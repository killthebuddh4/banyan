import { z } from "zod";

const requestSchema = z.object({
  id: z.string(),
  jsonrpc: z.literal("2.0").optional(),
  method: z.string(),
  params: z.unknown().optional(),
});

const notificationSchema = z.object({
  id: z.never(),
  jsonrpc: z.literal("2.0").optional(),
  method: z.string(),
  params: z.unknown().optional(),
});

export const rpcRequestSchema = z.union([requestSchema, notificationSchema]);
