import { DescriptiveError } from "../lib/DescriptiveError.js";
import { User } from "./User.js";
import { channelStore } from "./channelStore.js";

const NO_CHANNEL_ERROR = `
  You must create a channel before you can add a user to it. We attempted
  to add a user to a channel that does not exist.
`;

const ALREADY_A_MEMBER_ERROR = `
  Every user has a unique address. A channel cannot have two users with the same address.
  We attempted to add a user to a channel that already has a user with the same address.
`;

const MUST_BE_THE_INVITED_USER_ERROR = `
  Only the invited user can accept an invitation. We attempted to accept an invitation
  on behalf of another user.
`;

const MUST_BE_INVITED_ERROR = `
  Every channel has an owner. Only the owner can invite users to the channel.
  We attempted to add a user that has not been invited to the channel.
`;

export const updateChannelAddUser = ({
  userDoingTheAdding,
  userToAdd,
  channelAddress,
}: {
  userDoingTheAdding: User;
  userToAdd: User;
  channelAddress: string;
}) => {
  const channel = channelStore.get(channelAddress);

  if (!channel) {
    throw new DescriptiveError(
      NO_CHANNEL_ERROR,
      `Failed to add user ${userToAdd.address} to channel ${channelAddress} because the channel does not exist`,
    );
  }

  if (userDoingTheAdding.address !== userToAdd.address) {
    throw new DescriptiveError(
      MUST_BE_THE_INVITED_USER_ERROR,
      `Failed to add user ${userToAdd.address} to channel ${channelAddress} because the user doing the adding is not the invited user`,
    );
  }

  const alreadyMember = channel.members.find((m) => {
    return m.address === userToAdd.address;
  });

  if (alreadyMember !== undefined) {
    throw new DescriptiveError(
      ALREADY_A_MEMBER_ERROR,
      `Failed to add user ${userToAdd.address} to channel ${channelAddress} because the user is already a member`,
    );
  }

  const invitation = channel.invitations.find((m) => {
    return m.toAddress === userToAdd.address && m.status === "accepted";
  });

  if (invitation === undefined) {
    throw new DescriptiveError(
      MUST_BE_INVITED_ERROR,
      `Failed to add user ${userToAdd.address} to channel ${channelAddress} because the user has not been invited.`,
    );
  }

  channel.members.push(userToAdd);

  return channel;
};
