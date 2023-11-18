import { z } from "zod";
import { metadata } from "../metadata.js";

export const stream = metadata.merge(
  z.object({
    event: z.literal("stream"),
    data: z.object({
      stream: z.any(),
    }),
  }),
);
