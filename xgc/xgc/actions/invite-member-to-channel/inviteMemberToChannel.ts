import { Client } from "@xmtp/xmtp-js";
import { User } from "../../channel/User.js";
import { updateChannelInviteUser } from "../../channel/store/updateChannelnviteUser.js";
import { readChannel } from "../../channel/store/readChannel.js";
import { sendMessage } from "../../xmtp/sendMessage.js";

export const inviteMemberToChannel = async ({
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

  updateChannelInviteUser({
    userDoingTheInviting,
    userToInvite,
    channelAddress,
  });

  if (channel === undefined) {
    throw new Error(
      "Channel does not exist, updateChannelInviteUser should have thrown!",
    );
  }

  sendMessage({
    client: copilotClient,
    toAddress: userToInvite.address,
    content: createInvitationMessage({
      channelName: channel.name,
      userDoingTheInviting,
    }),
  });

  return { ok: true, result: { inviteSentToAddress: userToInvite.address } };
};

const createInvitationMessage = ({
  channelName,
  userDoingTheInviting,
}: {
  channelName: string;
  userDoingTheInviting: User;
}) => {
  return `
Hello, I'm an AI copilot operated by https://banyan.sh. You've been invited to
the group chat "${channelName}" by ${userDoingTheInviting.address}. Would you
like to accept the invitation?`.trim();
};
