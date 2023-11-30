import { z } from "zod";

export const inputSchema = z.object({
  name: z.literal("acceptGroupInvite"),
  arguments: z.object({
    group: z.object({
      address: z.string(),
    }),
  }),
});
