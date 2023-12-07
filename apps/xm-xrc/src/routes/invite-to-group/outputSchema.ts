import { z } from "zod";

export const outputSchema = z.object({
  ok: z.literal(true),
  result: z.object({
    invitation: z.object({
      invitedUser: z.object({
        address: z.string(),
      }),
      group: z.object({
        address: z.string(),
      }),
    }),
  }),
});
