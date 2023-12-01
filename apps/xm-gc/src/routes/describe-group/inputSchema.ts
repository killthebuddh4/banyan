import { z } from "zod";

export const inputSchema = z.object({
  name: z.literal("describeGroup"),
  arguments: z.object({
    group: z.object({
      address: z.string(),
    }),
  }),
});
