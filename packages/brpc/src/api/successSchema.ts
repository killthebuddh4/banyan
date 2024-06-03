import { z } from "zod";

export const successSchema = z.object({
  ok: z.literal(true),
  status: z.literal("OK"),
  data: z.unknown(),
});
