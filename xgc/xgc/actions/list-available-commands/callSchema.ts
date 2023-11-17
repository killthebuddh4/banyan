import { z } from "zod";

export const callSchema = z.object({
  name: z.literal("listAvailableCommands"),
  arguments: z.object({
    options: z
      .object({
        nameOnly: z.boolean().optional(),
      })
      .optional(),
  }),
});
