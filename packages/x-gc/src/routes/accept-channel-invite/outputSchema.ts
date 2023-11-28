import { z } from "zod";

export const outputSchema = z.object({
  ok: z.literal(true),
  result: z.object({
    userAcceptedAddress: z.string(),
    channelAddress: z.string(),
  }),
});
