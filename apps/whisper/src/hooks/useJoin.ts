import { useOwnerStore } from "./useOwnerStore.js";
import { createProcedure } from "@killthebuddha/brpc";

const MAX_GROUP_SIZE = 10;

export const useJoin = () => {
  const members = useOwnerStore((state) => state.members);
  const alias = useOwnerStore((state) => state.alias);

  return createProcedure({
    auth: async () => true,
    handler: async (args: { alias: string }, ctx) => {
      if (Object.values(members).length >= MAX_GROUP_SIZE) {
        return { joined: false, reason: "GROUP_IS_FULL" };
      }

      const found = Object.values(members).find(
        (member) => member.alias === args.alias,
      );

      if (alias === null) {
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

      return { joined: true, ownerAlias: alias };
    },
  });
};
