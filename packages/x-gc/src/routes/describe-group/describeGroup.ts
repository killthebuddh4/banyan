import { z } from "zod";
import { db } from "../../lib/db.js";
import { outputSchema } from "./outputSchema.js";
import { getCurrentStatus } from "../../lib/getCurrentStatus.js";

export const describeGroup = async ({
  userDoingTheReading,
  group,
}: {
  userDoingTheReading: { address: string };
  group: { address: string };
}): Promise<z.infer<typeof outputSchema>> => {
  const groupFromDb = await db.group.findFirstOrThrow({
    where: {
      address: group.address,
      owner: {
        address: userDoingTheReading.address,
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      invitations: {
        include: {
          invitedUser: true,
          invitedByUser: true,
          status: {
            select: {
              status: true,
            },
          },
        },
      },
      owner: true,
      creator: true,
    },
  });

  if (groupFromDb === undefined) {
    return { ok: false, result: { message: "Channel not found" } };
  }

  return {
    ok: true,
    result: {
      description: {
        address: groupFromDb.address,
        owner: { address: groupFromDb.owner.address },
        creator: { address: groupFromDb.creator.address },
        name: groupFromDb.name,
        description: groupFromDb.description,
        createdAt: groupFromDb.createdAt,
        invitations: groupFromDb.invitations.map((invitation) => ({
          invitedUser: { address: invitation.invitedUser.address },
          invitedByUser: { address: invitation.invitedByUser.address },
          status: getCurrentStatus({ statuses: invitation.status }),
        })),
        members: groupFromDb.members.map((member) => ({
          address: member.user.address,
        })),
      },
    },
  };
};
