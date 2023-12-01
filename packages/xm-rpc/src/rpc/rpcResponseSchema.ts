import { z } from "zod";
import { rpcErrorSchema } from "./rpcErrorSchema.js";

export const rpcResponseSchema = z.union([
  z.object({
    id: z.string(),
    result: z.unknown(),
  }),
  z.object({
    id: z.string(),
    error: rpcErrorSchema,
  }),
]);
