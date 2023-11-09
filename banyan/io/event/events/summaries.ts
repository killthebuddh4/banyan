import { z } from "zod";
import { metadata } from "../metadata.js";

export const summaries = metadata.merge(
  z.object({
    event: z.literal("summaries"),
    data: z.object({
      summaries: z.array(z.string()),
    }),
  }),
);
