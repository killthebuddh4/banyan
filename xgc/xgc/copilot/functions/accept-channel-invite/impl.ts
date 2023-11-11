import { Client } from "@xmtp/xmtp-js";
import { User } from "../../../channel/User.js";
import { updateChannelAcceptInvitation } from "../../../channel/updateChannelAcceptInvitation.js";
import { publishToChannel } from "../../../channel/publishToChannel.js";
import { updateChannelAddUser } from "../../../channel/updateChannelAddUser.js";

export const impl = async ({
  userDoingTheAccepting,
  channelAddress,
  copilotClient,
}: {
  userDoingTheAccepting: User;
  channelAddress: string;
  copilotClient: Client;
}) => {
  let channel = updateChannelAcceptInvitation({
    userDoingTheAccepting,
    channelAddress,
  });

  channel = updateChannelAddUser({
    userDoingTheAdding: userDoingTheAccepting,
    userToAdd: userDoingTheAccepting,
    channelAddress,
  });

  publishToChannel({
    fromUser: { address: copilotClient.address },
    channel,
    message: `${userDoingTheAccepting.address} has joined the channel.`,
  });

  return channel;
};
