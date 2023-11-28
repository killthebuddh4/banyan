import { z } from "zod";

export const parseErrorSchema = z.object({
  code: z.literal(-32700),
  message: z.string(),
  data: z.object({
    label: z.literal("parse-error"),
    description: z.string(),
  }),
});
