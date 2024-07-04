import { ownerStore } from "./ownerStore";
import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";

export const post = createProcedure<{ text: string }, { posted: boolean }>({
  auth: async ({ context }) => {
    const members = ownerStore.getState().members;

    const found = Object.keys(members).find(
      (address) => address === context.message.senderAddress,
    );

    return found !== undefined;
  },
  handler: async ({ text }, ctx) => {
    ownerStore.setState((state) => {
      const prev = state.messages.find((m) => m.id === ctx.message.id);

      if (prev !== undefined) {
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
          },
        ],
      };
    });

    return { posted: true };
  },
});
