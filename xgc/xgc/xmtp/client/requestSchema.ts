import { z } from "zod";
import { jsonStringSchema } from "../../lib/jsonStringSchema.js";

export const requestSchema = jsonStringSchema.pipe(
  z.object({
    requestId: z.string(),
    content: z.unknown(),
  }),
);
