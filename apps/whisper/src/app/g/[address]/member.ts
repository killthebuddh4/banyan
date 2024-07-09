import { create } from "zustand";
import { createProcedure } from "@killthebuddha/brpc";
import { Signer } from "@killthebuddha/fig";

export type Whisper = {
  id: string;
  timestamp: number;
  sender: string;
  text: string;
  alias: string;
};

export const useMemberStore = create<{
  alias: string | null;
  aliasInput: string;
  messageInput: string;
  wallet: Signer | undefined;
  isSending: boolean;
  messages: Whisper[];
  owner: { address: string; alias: string; lastSeen: number } | null;
  isJoining: boolean;
  isJoined: boolean;
}>(() => ({
  alias: null,
  aliasInput: "",
  messageInput: "",
  wallet: undefined,
  isSending: false,
  messages: [],
  owner: null,
  isJoining: false,
  isJoined: false,
}));

export const ping = createProcedure({
  auth: async ({ context }) => {
    const owner = useMemberStore.getState().owner;

    if (owner === null) {
      return false;
    }

    return owner.address === context.message.senderAddress;
  },
  handler: async (_, ctx) => {
    useMemberStore.setState((state) => {
      return {
        ...state,
        owner: {
          address: ctx.message.senderAddress,
          alias: "owner",
          lastSeen: Date.now(),
        },
      };
    });
    return { pong: true };
  },
});

export const sync = createProcedure({
  auth: async ({ context }) => {
    const owner = useMemberStore.getState().owner;

    if (owner === null) {
      return false;
    }

    return owner.address === context.message.senderAddress;
  },
  handler: async ({ messages }: { messages: Whisper[] }) => {
    console.log("MEMBER :: SYNC API :: CALLED");
    useMemberStore.setState((state) => {
      return { ...state, messages };
    });

    return { synced: true };
  },
});
