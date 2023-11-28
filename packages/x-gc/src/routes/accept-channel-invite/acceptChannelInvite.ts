import { User } from "../../db/User.js";
import { updateChannelAcceptInvitation } from "../../db/store/updateChannelAcceptInvitation.js";
import { publishToChannel } from "../../db/publishToChannel.js";
import { updateChannelAddUser } from "../../db/store/updateChannelAddUser.js";

export const acceptChannelInvite = async ({
  userDoingTheAccepting,
  channelAddress,
  copilotAddress,
}: {
  userDoingTheAccepting: User;
  channelAddress: string;
  copilotAddress: string;
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
    fromUser: { address: copilotAddress },
    channel,
    message: `${userDoingTheAccepting.address} has joined the channel.`,
  });

  return {
    ok: true,
    result: {
      userAcceptedAddress: userDoingTheAccepting.address,
      channelAddress: channel.address,
    },
  } as const;
};
