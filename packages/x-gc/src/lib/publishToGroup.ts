import { db } from "./db.js";
import { cacheStore } from "../cache/cacheStore.js";
import { getGroupServer } from "../cache/getGroupServer.js";

export const publishToGroup = async ({
  fromMember,
  group,
  message,
}: {
  fromMember: { address: string };
  group: { address: string };
  message: string;
}) => {
  const groupServer = getGroupServer({
    store: cacheStore,
    address: group.address,
  });

  if (groupServer === undefined) {
    // TODO UX considerations.
    throw new Error(`Group server not found`);
  }

  const members = await db.groupMember.findMany({
    where: {
      group: {
        address: group.address,
      },
    },
    include: {
      user: true,
    },
  });

  const conversations = await Promise.all(
    members.map((member) => {
      return groupServer.client.conversations.newConversation(
        member.user.address,
      );
    }),
  );

  const sent = await Promise.all(
    conversations.map((conversation) => {
      return conversation.send(`${fromMember.address}: ${message}`);
    }),
  );

  return sent;
};
