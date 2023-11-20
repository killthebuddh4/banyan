import { z } from "zod";

export const callSchema = z.object({
  name: z.literal("createChannel"),
  arguments: z.object({
    name: z.string(),
    description: z.string(),
  }),
});
