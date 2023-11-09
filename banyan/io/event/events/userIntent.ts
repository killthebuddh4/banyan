import { z } from "zod";
import { metadata } from "../metadata.js";

export const userIntent = metadata.merge(
  z.object({
    event: z.literal("user-intent"),
    data: z.object({
      botId: z.string(),
      userId: z.string(),
      intent: z.string(),
    }),
  }),
);
