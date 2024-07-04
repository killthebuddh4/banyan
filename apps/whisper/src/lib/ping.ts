import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";

export const ping = createProcedure({
  auth: async () => true,
  handler: async () => {
    return { pong: true };
  },
});
