import { z } from "zod";

export const signature = z.object({
  name: z.literal("acceptChannelInvite"),
  arguments: z.object({
    channelAddress: z.string(),
  }),
});
