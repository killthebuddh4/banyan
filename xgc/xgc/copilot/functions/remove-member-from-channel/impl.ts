import { Client } from "@xmtp/xmtp-js";
import { User } from "../../../channel/User.js";
import { publishToChannel } from "../../../channel/publishToChannel.js";
import { updateChannelRemoveUser } from "../../../channel/updateChannelRemoveUser.js";

export const impl = async ({
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

  return channel;
};
