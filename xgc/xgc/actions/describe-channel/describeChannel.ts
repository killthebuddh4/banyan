import { User } from "../../channel/User.js";
import { readChannel } from "../../channel/store/readChannel.js";
import { getChannelDescription } from "../../channel/getChannelDescription.js";

export const describeChannel = async ({
  userDoingTheReading,
  channelAddress,
}: {
  userDoingTheReading: User;
  channelAddress: string;
}) => {
  const channel = readChannel({
    userDoingTheReading,
    channelAddress,
  });

  if (channel === undefined) {
    throw new Error("Channel not found.");
  }

  const description = getChannelDescription({ channel });

  return { ok: true, result: { channelDescription: description } };
};
