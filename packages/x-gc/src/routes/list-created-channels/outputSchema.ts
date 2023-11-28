import { z } from "zod";

export const outputSchema = z.object({
  ok: z.literal(true),
  result: z.object({
    createdChannels: z.array(
      z.object({
        address: z.string(),
        numMembers: z.number(),
        numInvited: z.number(),
      }),
    ),
  }),
});
