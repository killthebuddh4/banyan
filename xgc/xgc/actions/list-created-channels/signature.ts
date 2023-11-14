import { z } from "zod";
import { jsonStringSchema } from "../../lib/jsonStringSchema.js";

export const signature = z.object({
  name: z.literal("listCreatedChannels"),
  arguments: jsonStringSchema.pipe(z.object({})),
});
