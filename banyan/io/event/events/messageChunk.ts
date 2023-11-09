import { z } from "zod";
import { metadata } from "../metadata.js";

export const messageChunk = metadata.merge(
  z.object({
    event: z.literal("message-chunk"),
    data: z.object({
      botId: z.string(),
      messageId: z.string(),
      seq: z.number().nonnegative(),
      text: z.string(),
    }),
  }),
);
