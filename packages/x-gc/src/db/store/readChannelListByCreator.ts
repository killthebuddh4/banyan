import { DescriptiveError } from "x-core/lib/DescriptiveError.js";
import { User } from "../User.js";
import { channelStore } from "./channelStore.js";
import { CONFIG } from "../CONFIG.js";

const NOT_THE_CREATOR_ERROR = `
  Every channel has a creator. Only the creator can read the channel.
  We attempted to read the created channels on behalf of another creator.
`;

export const readChannelListByCreator = async ({
  userDoingTheReading,
  creator,
}: {
  userDoingTheReading: User;
  creator: User;
}) => {
  if (
    userDoingTheReading.address !== creator.address &&
    userDoingTheReading.address !== CONFIG.superuserAddress
  ) {
    throw new DescriptiveError(
      NOT_THE_CREATOR_ERROR,
      `Failed to read channels created by ${creator.address} because the user doing the reading is not the creator`,
    );
  }

  const channels = Array.from(channelStore.values());
  return channels.filter(
    (channel) => channel.creator.address === creator.address,
  );
};
