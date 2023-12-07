import { z } from "zod";

export const inputSchema = z.object({
  name: z.literal("createGroup"),
  arguments: z.object({
    name: z.string(),
    description: z.string(),
  }),
});
