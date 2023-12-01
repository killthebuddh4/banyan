import { z } from "zod";

export const badRequestSchema = z.object({
  code: z.literal(-32600),
  message: z.string(),
  data: z.object({
    label: z.literal("bad-request"),
    description: z.string(),
  }),
});
