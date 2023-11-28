import { z } from "zod";

export const invalidParamsSchema = z.object({
  code: z.literal(-32602),
  message: z.string(),
  data: z.object({
    label: z.literal("invalid-params"),
    description: z.string(),
  }),
});
