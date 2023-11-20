import { z } from "zod";

export const responseSchema = z.object({
  ok: z.literal(true),
  result: z.object({
    declinedInviteToChannelAddress: z.string(),
  }),
});
