import { Client } from "@xmtp/xmtp-js";
import { User } from "../../channel/User.js";
import { updateChannelAcceptInvitation } from "../../channel/store/updateChannelAcceptInvitation.js";
import { publishToChannel } from "../../channel/publishToChannel.js";
import { updateChannelAddUser } from "../../channel/store/updateChannelAddUser.js";

export const acceptChannelInvite = async ({
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

  return {
    ok: true,
    result: {
      userAcceptedAddress: userDoingTheAccepting.address,
      channelAddress: channel.address,
    },
  };
};
