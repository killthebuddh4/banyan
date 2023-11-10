import { z } from "zod";

export const signature = z.object({
  name: z.literal("leaveChannel"),
  arguments: z.object({
    channelAddress: z.string(),
  }),
});
