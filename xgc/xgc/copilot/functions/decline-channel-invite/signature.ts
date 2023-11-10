import { z } from "zod";

export const signature = z.object({
  name: z.literal("declineChannelInvite"),
  arguments: z.object({
    channelAddress: z.string(),
  }),
});
