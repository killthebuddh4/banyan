import { z } from "zod";
import { channelDescriptionSchema } from "../../db/channelDescriptionSchema.js";

const successSchema = z.object({
  ok: z.literal(true),
  result: z.object({
    channelDescription: channelDescriptionSchema,
  }),
});

const failureSchema = z.object({
  ok: z.literal(false),
  result: z.object({
    message: z.string(),
  }),
});

export const outputSchema = z.union([successSchema, failureSchema]);
