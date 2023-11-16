import { z } from "zod";
import { jsonStringSchema } from "../../lib/jsonStringSchema.js";

export const callSchema = z.object({
  name: z.literal("createChannel"),
  arguments: jsonStringSchema.pipe(
    z.object({
      name: z.string(),
      description: z.string(),
    }),
  ),
});
