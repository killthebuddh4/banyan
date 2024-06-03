import { z } from "zod";

export const responseSchema = z.object({
  jsonrpc: z.literal("2.0"),
  result: z.unknown(),
  id: z.string().uuid(),
});
