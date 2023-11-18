import { z } from "zod";

export const callSchema = z.object({
  name: z.literal("declineChannelInvite"),
  arguments: z.object({
    channelAddress: z.string(),
  }),
});
