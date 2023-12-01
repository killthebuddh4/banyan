import { z } from "zod";

export const outputSchema = z.object({
  ok: z.literal(true),
  result: z.object({
    heartbeat: z.literal(true),
  }),
});
