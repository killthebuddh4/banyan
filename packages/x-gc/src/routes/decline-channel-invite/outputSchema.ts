import { z } from "zod";

export const outputSchema = z.object({
  ok: z.literal(true),
  result: z.object({
    declinedInviteToChannelAddress: z.string(),
  }),
});
