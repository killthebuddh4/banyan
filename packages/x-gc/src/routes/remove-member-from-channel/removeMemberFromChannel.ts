import { Client } from "@xmtp/xmtp-js";
import { User } from "../../db/User.js";
import { publishToChannel } from "../../db/publishToChannel.js";
import { updateChannelRemoveUser } from "../../db/store/updateChannelRemoveUser.js";

export const removeMemberFromChannel = async ({
  userDoingTheRemoving,
  userToRemove,
  channelAddress,
  copilotClient,
}: {
  userDoingTheRemoving: User;
  userToRemove: User;
  channelAddress: string;
  copilotClient: Client;
}) => {
  const channel = updateChannelRemoveUser({
    userDoingTheRemoving,
    userToRemove,
    channelAddress,
  });

  publishToChannel({
    fromUser: { address: copilotClient.address },
    channel,
    message: `${userToRemove.address} has left the channel.`,
  });

  return {
    ok: true,
    result: { removedUserAddress: userToRemove.address },
  } as const;
};
