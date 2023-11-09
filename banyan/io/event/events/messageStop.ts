import { z } from "zod";
import { metadata } from "../metadata.js";

export const messageStop = metadata.merge(
  z.object({
    event: z.literal("message-stop"),
    data: z.object({
      botId: z.string(),
      messageId: z.string(),
      reason: z.string(),
    }),
  }),
);
