import { z } from "zod";
import { jsonStringSchema } from "../../lib/jsonStringSchema.js";

export const signature = z.object({
  name: z.literal("removeMemberFromChannel"),
  arguments: jsonStringSchema.pipe(
    z.object({
      memberAddress: z.string(),
      channelAddress: z.string(),
    }),
  ),
});
