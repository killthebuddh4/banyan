import { db } from "../../lib/db.js";
import { cacheStore } from "../../cache/cacheStore.js";
import { deleteGroupServer } from "../../cache/deleteGroupServer.js";
import { getGroupServer } from "../../cache/getGroupServer.js";
import { publishToGroup } from "../../lib/publishToGroup.js";

export const deleteGroup = async ({
  owner,
  group,
  copilotAddress,
}: {
  owner: { address: string };
  group: {
    address: string;
  };
  copilotAddress: string;
}) => {
  const deleted = await db.group.delete({
    where: {
      address: group.address,
      owner,
    },
  });

  const groupServer = getGroupServer({
    store: cacheStore,
    address: deleted.address,
  });

  if (groupServer === undefined) {
    // TODO UX considerations.
    throw new Error(`Group server not found`);
  }

  groupServer.stop();

  const members = await db.groupMember.findMany({
    where: {
      group: {
        address: deleted.address,
      },
    },
    include: {
      user: true,
    },
  });

  // TODO, we might want to have some kind of job queue here to make sure that
  // all the users get notified.
  publishToGroup({
    fromMember: { address: copilotAddress },
    group: { address: deleted.address },
    message: `This channel's owner has deleted the channel, messages will no longer be broadcast to the rest of the channel's members.`,
  });

  deleteGroupServer({
    store: cacheStore,
    address: deleted.address,
  });

  return {
    ok: true,
    result: {
      deleteGroup: {
        address: deleted.address,
      },
    },
  } as const;
};
