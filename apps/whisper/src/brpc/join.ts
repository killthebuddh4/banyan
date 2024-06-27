import { store } from "./store";
import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";

const MAX_GROUP_SIZE = 10;

export const join = createProcedure({
  auth: async () => true,
  handler: async (_, ctx) => {
    console.log("WHISPER :: join :: called");

    if (store.getState().members.length >= MAX_GROUP_SIZE) {
      return { joined: false };
    }

    store.setState((state) => {
      const members = new Set(state.members);
      members.add(ctx.message.senderAddress);
      return { members: Array.from(members) };
    });

    return { joined: true };
  },
});
