import { z } from "zod";

export const inputSchema = z.object({
  name: z.literal("describeChannel"),
  arguments: z.object({
    channelAddress: z.string(),
  }),
});
