import { DescriptiveError } from "../lib/DescriptiveError.js";
import { User } from "./User.js";
import { channelStore } from "./channelStore.js";

const NO_CHANNEL_ERROR = `
  You must create a channel before you can accept an invitation from it. We attempted
  to accept an invitation to a channel that does not exist.
`;

const NO_INVITATION_ERROR = `
  You can only accept a channel invitation if you have already been invited to the channel. We attempted
  to accept an invitation to a channel before we were invited.
`;

export const updateChannelAcceptInvitation = ({
  userDoingTheAccepting,
  channelAddress,
}: {
  userDoingTheAccepting: User;
  channelAddress: string;
}) => {
  const channel = channelStore.get(channelAddress);

  if (!channel) {
    throw new DescriptiveError(
      NO_CHANNEL_ERROR,
      `Failed to accept invite for user ${userDoingTheAccepting.address} to channel ${channelAddress} because the channel does not exist`,
    );
  }

  const invitation = channel.invitations.find((m) => {
    return m.toAddress === userDoingTheAccepting.address;
  });

  if (invitation === undefined) {
    throw new DescriptiveError(
      NO_INVITATION_ERROR,
      `Failed to accept invitation to user ${userDoingTheAccepting.address} to channel ${channelAddress} because the user has not been invited.`,
    );
  }

  const updatedInvitations = channel.invitations.filter((m) => {
    return m.toAddress !== userDoingTheAccepting.address;
  });

  updatedInvitations.push({
    toAddress: userDoingTheAccepting.address,
    status: "accepted",
  });

  channel.invitations = updatedInvitations;
};
