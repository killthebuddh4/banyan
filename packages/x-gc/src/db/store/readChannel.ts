import { CONFIG } from "../CONFIG.js";
import { DescriptiveError } from "x-core/lib/DescriptiveError.js";
import { User } from "../User.js";
import { channelStore } from "./channelStore.js";

const NOT_THE_OWNER_ERROR_DESCRIPTION = `
  Every channel has an owner. Only the owner can read the channel.
  We attempted to read a channel for which the user is not the owner.
`;

export const readChannel = ({
  userDoingTheReading,
  channelAddress,
}: {
  userDoingTheReading: User;
  channelAddress: string;
}) => {
  const channel = channelStore.get(channelAddress);

  if (channel === undefined) {
    return channel;
  }

  if (
    channel.owner.address !== userDoingTheReading.address &&
    userDoingTheReading.address !== CONFIG.superuserAddress
  ) {
    throw new DescriptiveError(
      NOT_THE_OWNER_ERROR_DESCRIPTION,
      `Failed to read channel ${channelAddress} because the user doing the reading is not the owner`,
    );
  }

  return channel;
};
