import { DescriptiveError } from "../lib/DescriptiveError.js";
import { User } from "./User.js";
import { channelStore } from "./channelStore.js";

const NO_CHANNEL_ERROR = `
  You must create a channel before you can decline an invitation from it. We attempted
  to decline an invitation to a channel that does not exist.
`;

const NO_INVITATION_ERROR = `
  You can only decline a channel invitation if you have already been invited to the channel. We attempted
  to decline an invitation to a channel before we were invited.
`;

export const updateChannelDeclineInvitation = ({
  userDoingTheDeclining,
  channelAddress,
}: {
  userDoingTheDeclining: User;
  channelAddress: string;
}) => {
  const channel = channelStore.get(channelAddress);

  if (!channel) {
    throw new DescriptiveError(
      NO_CHANNEL_ERROR,
      `Failed to decline invitation for user ${userDoingTheDeclining.address} to channel ${channelAddress} because the channel does not exist`,
    );
  }

  const invitation = channel.invitations.find((m) => {
    return m.toAddress === userDoingTheDeclining.address;
  });

  if (invitation === undefined) {
    throw new DescriptiveError(
      NO_INVITATION_ERROR,
      `Failed to decline invitation to user ${userDoingTheDeclining.address} to channel ${channelAddress} because the user has not been invited.`,
    );
  }

  const updatedInvitations = channel.invitations.filter((m) => {
    return m.toAddress !== userDoingTheDeclining.address;
  });

  updatedInvitations.push({
    toAddress: userDoingTheDeclining.address,
    status: "declined",
  });

  channel.invitations = updatedInvitations;
};
