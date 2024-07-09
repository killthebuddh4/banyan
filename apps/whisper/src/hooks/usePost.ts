import { useOwnerStore } from "./useOwnerStore.js";
import { createProcedure } from "@killthebuddha/brpc";

export const usePost = () => {
  const members = useOwnerStore((state) => state.members);

  return createProcedure<{ text: string }, { posted: boolean }>({
    auth: async ({ context }) => {
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
};
