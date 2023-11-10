import { DescriptiveError } from "../../lib/DescriptiveError.js";
import { User } from "../User.js";
import { channelStore } from "./channelStore.js";

const NO_CHANNEL_ERROR = `
  You must create a channel before you can remove a user from it. We attempted
  to remove a user from a channel that does not exist.
`;

const NOT_A_MEMBER_ERROR = `
  We attempted to remove a user from a channel that the user is not a member of.
`;

const MUST_BE_OWNER_ERROR = `
  Every channel has an owner. Only the owner can remove users from the channel.
  We attempted to remove a user from a channel without the owner's permission.
`;

export const updateChannelRemoveUser = ({
  userDoingTheRemoving,
  user,
  channelAddress,
}: {
  userDoingTheRemoving: User;
  user: User;
  channelAddress: string;
}) => {
  const channel = channelStore.get(channelAddress);

  if (!channel) {
    throw new DescriptiveError(
      NO_CHANNEL_ERROR,
      `Failed to remove user ${user.address} from channel ${channelAddress} because the channel does not exist`,
    );
  }

  if (channel.owner.address !== userDoingTheRemoving.address) {
    throw new DescriptiveError(
      MUST_BE_OWNER_ERROR,
      `Failed to remove user ${user.address} from channel ${channelAddress} because the user doing the removing is not the owner`,
    );
  }

  const memberIndex = channel.members.findIndex((m) => {
    return m.address === user.address;
  });

  if (memberIndex === -1) {
    throw new DescriptiveError(
      NOT_A_MEMBER_ERROR,
      `Failed to remove user ${user.address} from channel ${channelAddress} because the user is not a member`,
    );
  }

  channel.members.splice(memberIndex, 1);
};
