import { z } from "zod";
import { db } from "../../lib/db.js";

export const declineInvite = async ({
  userDoingTheDeclining,
  group,
}: {
  userDoingTheDeclining: { address: string };
  group: { address: string };
}) => {
  const invitation = await db.invitation.findFirst({
    where: {
      group: {
        address: group.address,
      },
      invitedUser: {
        address: userDoingTheDeclining.address,
      },
    },
    include: {
      status: true,
    },
  });

  if (invitation === null) {
    throw new Error(
      `User ${userDoingTheDeclining.address} has not been invited to group ${group.address}`,
    );
  }

  const isAlreadyAccepted = Boolean(
    invitation.status.find((s) => s.status === "accepted"),
  );

  if (isAlreadyAccepted) {
    throw new Error(
      `User ${userDoingTheDeclining.address} has already accepted the invitation to group ${group.address}`,
    );
  }

  const isAlreadyDeclined = Boolean(
    invitation.status.find((s) => s.status === "declined"),
  );

  if (isAlreadyDeclined) {
    throw new Error(
      `User ${userDoingTheDeclining.address} has already declined the invitation to group ${group.address}`,
    );
  }

  const status = await db.invitationStatus.create({
    data: {
      invitation: {
        connect: {
          id: invitation.id,
        },
      },
      status: "declined",
    },
  });

  return {
    ok: true,
    result: {
      invitationStatus: {
        status: z.literal("declined").parse(status.status),
      },
    },
  } as const;
};
