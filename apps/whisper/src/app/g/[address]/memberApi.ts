import { create } from "zustand";
import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";

type Whisper = {
  id: string;
  timestamp: number;
  sender: string;
  text: string;
};

export const useMemberStore = create<{
  owner: { address: string; alias: string; lastSeen: number } | null;
  messages: Whisper[];
}>(() => ({
  owner: null,
  messages: [],
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
    useMemberStore.setState((state) => {
      return { ...state, messages };
    });

    return { synced: true };
  },
});
