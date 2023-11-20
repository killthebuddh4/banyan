import { z } from "zod";

export const errorSchema = z.object({
  ok: z.literal(false),
  error: z.unknown(),
});
