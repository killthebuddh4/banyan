import { z } from "zod";

export const inputSchema = z.object({
  name: z.literal("deleteMember"),
  arguments: z.object({
    member: z.object({
      address: z.string(),
    }),
    group: z.object({
      address: z.string(),
    }),
  }),
});
