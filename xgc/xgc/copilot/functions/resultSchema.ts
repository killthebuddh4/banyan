import { z } from "zod";

export const resultSchema = z.union([
  z.object({
    ok: z.literal(true),
    result: z.object({}),
  }),
  z.object({
    ok: z.literal(false),
    error: z.string(),
  }),
]);
