import { Client } from "@xmtp/xmtp-js";
import { publishToGroup } from "../../lib/publishToGroup.js";
import { db } from "../../lib/db.js";

export const deleteMember = async ({
  userDoingTheRemoving,
  userToRemove,
  group,
  copilotClient,
}: {
  userDoingTheRemoving: { address: string };
  userToRemove: { address: string };
  group: {
    address: string;
  };
  copilotClient: Client;
}) => {
  await db.groupMember.deleteMany({
    where: {
      group: {
        address: group.address,
      },
      user: {
        address: userToRemove.address,
      },
    },
  });

  publishToGroup({
    fromMember: { address: copilotClient.address },
    group,
    message: `${userToRemove.address} has left the channel.`,
  });

  return {
    ok: true,
    result: { deletedMember: { address: userToRemove.address } },
  } as const;
};
