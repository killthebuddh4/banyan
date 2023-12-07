import { DecodedMessage } from "@xmtp/xmtp-js";
import { db } from "./db.js";

export const createGroupServerSelector = ({
  group,
}: {
  group: { address: string };
}) => {
  return async (message: DecodedMessage) => {
    if (message.content === undefined) {
      return false;
    }

    if (message.content.length === 0) {
      return false;
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

    return Boolean(
      members.find((member) => {
        return member.user.address === message.senderAddress;
      }),
    );
  };
};
