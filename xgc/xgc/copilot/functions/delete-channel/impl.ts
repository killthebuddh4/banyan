import { DescriptiveError } from "../../../lib/DescriptiveError.js";
import { User } from "../../../channel/User.js";
import { readChannel } from "../../../channel/readChannel.js";
import { deleteChannel } from "../../../channel/deleteChannel.js";

const NO_CHANNEL_ERROR_DESCRIPTION = `
  We attempted to delete a channel that does not exist.
`;

export const impl = async ({
  userDoingTheDeleting,
  channelAddress,
}: {
  userDoingTheDeleting: User;
  channelAddress: string;
}) => {
  const channel = readChannel({
    userDoingTheReading: userDoingTheDeleting,
    channelAddress,
  });

  if (channel === undefined) {
    throw new DescriptiveError(
      NO_CHANNEL_ERROR_DESCRIPTION,
      `Failed to delete channel ${channelAddress} because the channel does not exist`,
    );
  }

  return deleteChannel({ userDoingTheDeleting, channel });
};
