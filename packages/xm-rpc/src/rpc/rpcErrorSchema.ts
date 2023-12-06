import { z } from "zod";
import { methodNotFoundSchema } from "../errors/methodNotFoundSchema.js";
import { internalErrorSchema } from "../errors/internalServerErrorSchema.js";
import { badRequestSchema } from "../errors/badRequestSchema.js";
import { parseErrorSchema } from "../errors/parseErrorSchema.js";
import { invalidParamsSchema } from "../errors/invalidParamsSchema.js";

export const rpcErrorSchema = z.union([
  parseErrorSchema,
  badRequestSchema,
  invalidParamsSchema,
  methodNotFoundSchema,
  internalErrorSchema,
]);
