import { z } from "zod";

export const callSchema = z.object({
  name: z.literal("describeChannel"),
  arguments: z.object({
    channelAddress: z.string(),
  }),
});
