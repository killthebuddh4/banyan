import { z } from "zod";

export const inputSchema = z.object({
  name: z.literal("declineChannelInvite"),
  arguments: z.object({
    channelAddress: z.string(),
  }),
});
