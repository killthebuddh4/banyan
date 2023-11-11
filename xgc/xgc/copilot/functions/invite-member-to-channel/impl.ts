import { DescriptiveError } from "../../../lib/DescriptiveError.js";
import { Client } from "@xmtp/xmtp-js";
import { User } from "../../../channel/User.js";
import { updateChannelInviteUser } from "../../../channel/updateChannelnviteUser.js";
import { readChannel } from "../../../channel/readChannel.js";

const NO_CHANNEL_ERROR = `
  You tried to invite a user to a channel that does not exist.
`;

export const impl = async ({
  userDoingTheInviting,
  userToInvite,
  copilotClient,
  channelAddress,
}: {
  userDoingTheInviting: User;
  userToInvite: User;
  copilotClient: Client;
  channelAddress: string;
}) => {
  const channel = readChannel({
    userDoingTheReading: userDoingTheInviting,
    channelAddress,
  });

  if (channel === undefined) {
    throw new DescriptiveError(
      NO_CHANNEL_ERROR,
      `Failed to invite user ${userToInvite.address} to channel ${channelAddress} because the channel does not exist`,
    );
  }

  const conversation = await copilotClient.conversations.newConversation(
    userToInvite.address,
  );

  const sent = await conversation.send(
    `
Hello, I'm an AI copilot operated by https://banyan.sh. You've been invited to
the group chat "${channel.name}" by ${userDoingTheInviting.address}. Would you
like to accept the invitation?`.trim(),
  );

  updateChannelInviteUser({
    userDoingTheInviting,
    userToInvite,
    channelAddress: channel.address,
  });

  return sent;
};
