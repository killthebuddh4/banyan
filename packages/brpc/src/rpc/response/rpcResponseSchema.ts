import { z } from "zod";

export const rpcResponseSchema = z.object({
  jsonrpc: z.literal("2.0"),
  result: z.unknown(),
  id: z.string(),
});
