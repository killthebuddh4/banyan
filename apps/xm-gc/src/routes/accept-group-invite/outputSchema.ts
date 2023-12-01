import { z } from "zod";

export const outputSchema = z.object({
  ok: z.literal(true),
  result: z.object({
    invitationStatus: z.object({
      status: z.literal("accepted"),
    }),
  }),
});
