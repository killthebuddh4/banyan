import { z } from "zod";

export const methodNotFoundSchema = z.object({
  code: z.literal(-32601),
  message: z.string(),
  data: z.object({
    label: z.literal("method-not-found"),
    description: z.string(),
  }),
});
