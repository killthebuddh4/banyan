import { z } from "zod";

export const inputSchema = z.object({
  name: z.literal("acceptChannelInvite"),
  arguments: z.object({
    channelAddress: z.string(),
  }),
});
