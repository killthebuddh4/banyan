import { DescriptiveError } from "../../lib/DescriptiveError.js";
import { User } from "../User.js";
import { channelStore } from "./channelStore.js";

const NO_CHANNEL_ERROR = `
  You must create a channel before you can decline an invitation from it. We attempted
  to decline an invitation to a channel that does not exist.
`;

const NOT_THE_INVITED_USER_ERROR = `
  Only the invited user can decline an invitation. We attempted to decline an invitation
  on behalf of another user.
`;

const NO_INVITATION_ERROR = `
  You can only decline a channel invitation if you have already been invited to the channel. We attempted
  to decline an invitation to a channel before we were invited.
`;

const ALREADY_ACCEPTED_ERROR = `
  You can only decline a channel invitation that has not been accepted. We attempted to decline an invitation
  to a channel that we have already accepted.
`;

const ALREADY_DECLINED_ERROR = `
  You can only decline a channel invitation once. We attempted to decline an invitation to a channel
  that we have already declined.
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

  if (invitation.toAddress !== userDoingTheDeclining.address) {
    throw new DescriptiveError(
      NOT_THE_INVITED_USER_ERROR,
      `Failed to decline invitation to user ${userDoingTheDeclining.address} to channel ${channelAddress} because the user is not the invited user.`,
    );
  }

  if (invitation.status === "accepted") {
    throw new DescriptiveError(
      ALREADY_ACCEPTED_ERROR,
      `Failed to decline invitation to user ${userDoingTheDeclining.address} to channel ${channelAddress} because the user has already accepted the invitation.`,
    );
  }

  if (invitation.status === "declined") {
    throw new DescriptiveError(
      ALREADY_DECLINED_ERROR,
      `Failed to decline invitation to user ${userDoingTheDeclining.address} to channel ${channelAddress} because the user has already declined the invitation.`,
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

  return channel;
};
