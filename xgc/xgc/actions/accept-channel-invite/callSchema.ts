import { z } from "zod";

export const callSchema = z.object({
  name: z.literal("acceptChannelInvite"),
  arguments: z.object({
    channelAddress: z.string(),
  }),
});
