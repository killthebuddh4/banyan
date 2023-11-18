import { z } from "zod";
import { channelDescriptionSchema } from "../../channel/channelDescriptionSchema.js";

export const responseSchema = z.object({
  ok: z.literal(true),
  result: z.object({
    channelDescription: channelDescriptionSchema,
  }),
});
