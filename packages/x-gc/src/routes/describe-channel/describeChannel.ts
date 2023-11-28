import { z } from "zod";
import { User } from "../../db/User.js";
import { readChannel } from "../../db/store/readChannel.js";
import { getChannelDescription } from "../../db/getChannelDescription.js";
import { outputSchema } from "./outputSchema.js";

export const describeChannel = async ({
  userDoingTheReading,
  channelAddress,
}: {
  userDoingTheReading: User;
  channelAddress: string;
}): Promise<z.infer<typeof outputSchema>> => {
  const channel = readChannel({
    userDoingTheReading,
    channelAddress,
  });

  if (channel === undefined) {
    return { ok: false, result: { message: "Channel not found" } };
  }

  const description = getChannelDescription({ channel });

  return { ok: true, result: { channelDescription: description } };
};
