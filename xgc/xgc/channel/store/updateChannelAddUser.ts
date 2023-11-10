import { DescriptiveError } from "../../lib/DescriptiveError.js";
import { User } from "../User.js";
import { channelStore } from "./channelStore.js";

const NO_CHANNEL_ERROR = `
  You must create a channel before you can add a user to it. We attempted
  to add a user to a channel that does not exist.
`;

const ALREADY_A_MEMBER_ERROR = `
  Every user has a unique address. A channel cannot have two users with the same address.
  We attempted to add a user to a channel that already has a user with the same address.
`;

const MUST_BE_OWNER_ERROR = `
  Every channel has an owner. Only the owner can add users to the channel.
  We attempted to add a user to a channel without the owner's permission.
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

  if (channel.owner.address !== userDoingTheAdding.address) {
    throw new DescriptiveError(
      MUST_BE_OWNER_ERROR,
      `Failed to add user ${userToAdd.address} to channel ${channelAddress} because the user doing the adding is not the owner`,
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

  channel.members.push(userToAdd);
};
