import { z } from "zod";
import { metadata } from "../metadata.js";

export const messageHistory = metadata.merge(
  z.object({
    event: z.literal("message-history"),
    data: z.object({
      messages: z.array(
        z.object({
          role: z.enum(["assistant", "user"]),
          content: z.string(),
        }),
      ),
    }),
  }),
);
