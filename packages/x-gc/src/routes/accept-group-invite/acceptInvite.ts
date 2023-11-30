import { z } from "zod";
import { publishToGroup } from "../../lib/publishToGroup.js";
import { db } from "../../lib/db.js";

export const acceptInvite = async ({
  userDoingTheAccepting,
  group,
  copilotAddress,
}: {
  userDoingTheAccepting: { address: string };
  group: { address: string };
  copilotAddress: string;
}) => {
  const invitation = await db.invitation.findFirst({
    where: {
      group: {
        address: group.address,
      },
      invitedUser: {
        address: userDoingTheAccepting.address,
      },
    },
    include: {
      status: true,
    },
  });

  if (invitation === null) {
    throw new Error(
      `User ${userDoingTheAccepting.address} has not been invited to group ${group.address}`,
    );
  }

  const isAlreadyAccepted = Boolean(
    invitation.status.find((s) => s.status === "accepted"),
  );

  if (isAlreadyAccepted) {
    throw new Error(
      `User ${userDoingTheAccepting.address} has already accepted the invitation to group ${group.address}`,
    );
  }

  const isAlreadyDeclined = Boolean(
    invitation.status.find((s) => s.status === "declined"),
  );

  if (isAlreadyDeclined) {
    throw new Error(
      `User ${userDoingTheAccepting.address} has already declined the invitation to group ${group.address}`,
    );
  }

  const status = await db.invitationStatus.create({
    data: {
      invitation: {
        connect: {
          id: invitation.id,
        },
      },
      status: "accepted",
    },
  });

  publishToGroup({
    fromMember: { address: copilotAddress },
    group,
    message: `${userDoingTheAccepting.address} has joined the channel.`,
  });

  return {
    ok: true,
    result: {
      invitationStatus: {
        status: z.literal("accepted").parse(status.status),
      },
    },
  } as const;
};
