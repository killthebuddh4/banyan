import { z } from "zod";

export const inputSchema = z.object({
  name: z.literal("deleteChannel"),
  arguments: z.object({
    channelAddress: z.string(),
  }),
});
