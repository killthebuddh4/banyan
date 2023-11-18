import { DescriptiveError } from "../../lib/DescriptiveError.js";
import { Channel } from "../Channel.js";
import { User } from "../User.js";
import { channelStore } from "./channelStore.js";

const NOT_THE_OWNER_ERROR_DESCRIPTION = `
  Every channel has an owner. Only the owner can delete the channel.
  We attempted to delete a channel for which the user is not the owner.
`;

export const deleteChannel = ({
  userDoingTheDeleting,
  channel,
}: {
  userDoingTheDeleting: User;
  channel: Channel;
}) => {
  if (channel.owner.address !== userDoingTheDeleting.address) {
    throw new DescriptiveError(
      NOT_THE_OWNER_ERROR_DESCRIPTION,
      `Failed to delete channel ${channel.address} because the user doing the deleting is not the owner`,
    );
  }

  channelStore.delete(channel.address);
  return channel;
};
