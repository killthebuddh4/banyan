import { db } from "../../lib/db.js";

export const listGroups = async ({
  userDoingTheListing,
}: {
  userDoingTheListing: { address: string };
}) => {
  console.log("LISTING GROUPS");
  const groups = await db.group.findMany({
    where: {
      members: {
        some: {
          user: {
            address: userDoingTheListing.address,
          },
        },
      },
    },
  });

  return {
    ok: true,
    result: {
      groups: groups.map((g) => ({
        address: g.address,
      })),
    },
  } as const;
};
