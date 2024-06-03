import { z } from "zod";

export const errorSchema = z.object({
  ok: z.literal(false),
  status: z.union([
    z.literal("INTERNAL_ERROR"),
    z.literal("INVALID_INPUT"),
    z.literal("UNDEFINED_PROCEDURE"),
  ]),
  data: z.undefined().optional(),
});
