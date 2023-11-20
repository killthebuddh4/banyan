import { z } from "zod";

export const callSchema = z.object({
  name: z.literal("deleteChannel"),
  arguments: z.object({
    channelAddress: z.string(),
  }),
});
