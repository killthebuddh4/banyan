import { z } from "zod";

export const internalErrorSchema = z.object({
  code: z.literal(-32603),
  message: z.string(),
  data: z.object({
    label: z.literal("internal-error"),
    description: z.string(),
  }),
});
