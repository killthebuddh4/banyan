import { DescriptiveError } from "x-core/lib/DescriptiveError.js";
import { User } from "../User.js";
import { channelStore } from "./channelStore.js";

const NO_CHANNEL_ERROR = `
  You must create a channel before you can invite a user to it. We attempted
  to invite a user to a channel that does not exist.
`;

const ALREADY_INVITED_ERROR = `
  Every user has a unique address. You can only invite a user to a channel one time.
  We attempted to invite a user to a channel that has already been invited.
`;

const MUST_BE_OWNER_ERROR = `
  Every channel has an owner. Only the owner can invite users to the channel.
  We attempted to invite a user to a channel without the owner's permission.
`;

export const updateChannelInviteUser = ({
  userDoingTheInviting,
  userToInvite,
  channelAddress,
}: {
  userDoingTheInviting: User;
  userToInvite: User;
  channelAddress: string;
}) => {
  const channel = channelStore.get(channelAddress);

  if (!channel) {
    throw new DescriptiveError(
      NO_CHANNEL_ERROR,
      `Failed to invite user ${userToInvite.address} to channel ${channelAddress} because the channel does not exist`,
    );
  }

  if (channel.owner.address !== userDoingTheInviting.address) {
    throw new DescriptiveError(
      MUST_BE_OWNER_ERROR,
      `Failed to add user ${userToInvite.address} to channel ${channelAddress} because the user doing the adding is not the owner`,
    );
  }

  const alreadyInvited = channel.invitations.find((m) => {
    return m.toAddress === userToInvite.address;
  });

  if (alreadyInvited !== undefined) {
    throw new DescriptiveError(
      ALREADY_INVITED_ERROR,
      `Failed to invite user ${userToInvite.address} to channel ${channelAddress} because the user has already been invited.`,
    );
  }

  channel.invitations.push({
    toAddress: userToInvite.address,
    status: "pending",
  });
};
