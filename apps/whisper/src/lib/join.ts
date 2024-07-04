import { ownerStore } from "./ownerStore";
import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";

const MAX_GROUP_SIZE = 10;

export const join = createProcedure({
  auth: async () => true,
  handler: async (_, ctx) => {
    const members = ownerStore.getState().members;

    if (Object.values(members).length >= MAX_GROUP_SIZE) {
      return { joined: false };
    }

    ownerStore.setState((state) => {
      return {
        ...state,
        members: {
          ...state.members,
          [ctx.message.senderAddress]: {
            lastSeen: Date.now(),
            missedPings: 0,
          },
        },
      };
    });

    return { joined: true };
  },
});
