import { z } from "zod";
import { jsonStringSchema } from "../../lib/jsonStringSchema.js";

export const signature = z.object({
  name: z.literal("describeChannel"),
  arguments: jsonStringSchema.pipe(
    z.object({
      channelAddress: z.string(),
    }),
  ),
});
