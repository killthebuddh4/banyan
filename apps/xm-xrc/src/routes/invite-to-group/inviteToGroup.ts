import { Client } from "@xmtp/xmtp-js";
import { sendMessage } from "xm-lib/sendMessage.js";
import { db } from "../../lib/db.js";

export const inviteToGroup = async ({
  userDoingTheInviting,
  userToInvite,
  copilotClient,
  group,
}: {
  userDoingTheInviting: {
    address: string;
  };
  userToInvite: {
    address: string;
  };
  copilotClient: Client;
  group: {
    address: string;
  };
}) => {
  try {
    await db.user.create({
      data: {
        address: userToInvite.address,
      },
    });
  } catch (error) {
    // TODO Check if the error is because the user already exists
  }

  const groupFromDb = await db.group.findUnique({
    where: {
      address: group.address,
    },
    include: {
      owner: true,
    },
  });

  if (groupFromDb === null) {
    throw new Error(
      `Group ${group.address} does not exist or does not belong to ${userDoingTheInviting.address}`,
    );
  }

  if (groupFromDb.owner.address !== userDoingTheInviting.address) {
    throw new Error(
      `User ${userDoingTheInviting.address} does not own group ${group.address}`,
    );
  }

  const invitation = await db.invitation.create({
    data: {
      group: {
        connect: {
          address: group.address,
        },
      },
      invitedUser: {
        connect: {
          address: userToInvite.address,
        },
      },
      invitedByUser: {
        connect: {
          address: userDoingTheInviting.address,
        },
      },
      status: {
        create: {
          status: "pending",
        },
      },
    },
    include: {
      invitedUser: true,
      group: true,
    },
  });

  // TODO Do we need a job queue here to make sure the invitation is sent?
  sendMessage({
    client: copilotClient,
    toAddress: userToInvite.address,
    content: createInvitationMessage({
      group: { name: groupFromDb.name },
      userDoingTheInviting,
    }),
  });

  return {
    ok: true,
    result: {
      invitation: {
        invitedUser: {
          address: invitation.invitedUser.address,
        },
        group: {
          address: invitation.group.address,
        },
      },
    },
  } as const;
};

const createInvitationMessage = ({
  group,
  userDoingTheInviting,
}: {
  group: { name: string };
  userDoingTheInviting: { address: string };
}) => {
  return `
Hello, I'm an AI copilot operated by https://banyan.sh. You've been invited to
the group chat "${group.name}" by ${userDoingTheInviting.address}. Would you
like to accept the invitation?`.trim();
};
