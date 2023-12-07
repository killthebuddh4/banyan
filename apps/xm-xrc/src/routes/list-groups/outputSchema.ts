import { z } from "zod";

export const outputSchema = z.object({
  ok: z.literal(true),
  result: z.object({
    groups: z.array(
      z.object({
        address: z.string(),
      }),
    ),
  }),
});
