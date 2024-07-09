import { create } from "zustand";
import { createProcedure } from "@killthebuddha/brpc";
import { Signer } from "@killthebuddha/fig";

type Whisper = {
  id: string;
  timestamp: number;
  sender: string;
  alias: string;
  text: string;
};

export const useOwnerStore = create<{
  alias: string | null;
  aliasInput: string;
  messageInput: string;
  wallet: Signer | undefined;
  members: Record<
    string,
    { alias: string; firstSeen: number; lastSeen: number; missedPings: number }
  >;
  isSending: boolean;
  messages: Whisper[];
}>(() => ({
  alias: null,
  aliasInput: "",
  messageInput: "",
  wallet: undefined,
  members: {},
  messages: [],
  isSending: false,
}));

const MAX_GROUP_SIZE = 10;

export const join = createProcedure({
  auth: async () => true,
  handler: async (args: { alias: string }, ctx) => {
    const members = useOwnerStore.getState().members;

    if (Object.values(members).length >= MAX_GROUP_SIZE) {
      return { joined: false, reason: "GROUP_IS_FULL" };
    }

    const found = Object.values(members).find(
      (member) => member.alias === args.alias,
    );

    const ownerAlias = useOwnerStore.getState().alias;

    if (ownerAlias === null) {
      throw new Error(
        "WHISPER :: Owner.tsx :: owner alias is null when the join api was called",
      );
    }

    if (found !== undefined) {
      return { joined: false, reason: "ALIAS_ALREADY_EXISTS" };
    }

    useOwnerStore.setState((state) => {
      return {
        ...state,
        members: {
          ...state.members,
          [ctx.message.senderAddress]: {
            alias: args.alias,
            firstSeen: Date.now(),
            lastSeen: Date.now(),
            missedPings: 0,
          },
        },
      };
    });

    return { joined: true, ownerAlias };
  },
});

export const post = createProcedure<{ text: string }, { posted: boolean }>({
  auth: async ({ context }) => {
    const members = useOwnerStore.getState().members;

    const found = Object.keys(members).find(
      (address) => address === context.message.senderAddress,
    );

    return found !== undefined;
  },
  handler: async ({ text }, ctx) => {
    useOwnerStore.setState((state) => {
      const prev = state.messages.find((m) => m.id === ctx.message.id);

      if (prev !== undefined) {
        return state;
      }

      const member = state.members[ctx.message.senderAddress];

      if (member === undefined) {
        console.warn(
          "WHISPER :: Owner.tsx :: member not found in post handler but auth succeeded",
        );
        return state;
      }

      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: ctx.message.id,
            text,
            sender: ctx.message.senderAddress,
            timestamp: Date.now(),
            alias: member.alias,
          },
        ],
      };
    });

    return { posted: true };
  },
});
