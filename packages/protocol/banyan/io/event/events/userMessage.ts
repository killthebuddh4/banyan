import { z } from "zod";
import { metadata } from "../metadata.js";

export const userMessage = metadata.merge(
  z.object({
    event: z.literal("userMessage"),
    data: z.object({
      id: z.string(),
      text: z.string(),
    }),
  }),
);
