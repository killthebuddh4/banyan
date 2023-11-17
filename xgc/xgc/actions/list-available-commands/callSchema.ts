import { z } from "zod";
import { jsonStringSchema } from "../../lib/jsonStringSchema.js";

export const callSchema = z.object({
  name: z.literal("listAvailableCommands"),
  arguments: jsonStringSchema.pipe(
    z.object({
      options: z
        .object({
          nameOnly: z.boolean().optional(),
        })
        .optional(),
    }),
  ),
});