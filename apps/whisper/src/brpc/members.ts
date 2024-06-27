import { store } from "./store";
import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";

export const members = createProcedure({
  auth: async () => true,
  handler: async (args: { members: string[] }) => {
    store.setState((state) => {
      return {
        ...state,
        members: args.members,
      };
    });

    return { joined: true };
  },
});
