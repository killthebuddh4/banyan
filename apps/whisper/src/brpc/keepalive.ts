import { store } from "./store";
import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";

export const keepalive = createProcedure({
  auth: async () => true,
  handler: async (_, ctx) => {
    store.setState((state) => {
      return {
        ...state,
        presence: {
          ...state.presence,
          [ctx.message.senderAddress]: Date.now(),
        },
      };
    });
  },
});
