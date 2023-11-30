import { z } from "zod";

export const outputSchema = z.object({
  ok: z.literal(true),
  result: z.object({
    deleteGroup: z.object({
      address: z.string(),
    }),
  }),
});
