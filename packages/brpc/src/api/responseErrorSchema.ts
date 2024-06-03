import { z } from "zod";

export const errorSchema = z.object({
  jsonrpc: z.literal("2.0"),
  result: z.undefined().optional(),
  id: z.string().or(z.null()),
  error: z.object({
    code: z.number(),
    message: z.string(),
    data: z.object({
      description: z.string(),
    }),
  }),
});
