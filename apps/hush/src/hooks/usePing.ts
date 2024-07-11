import { createProcedure } from "@killthebuddha/brpc";
import { useMemberStore } from "./useMemberStore";

export const usePing = () => {
  const owner = useMemberStore((s) => s.owner);

  return createProcedure({
    auth: async ({ context }) => {
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
};
