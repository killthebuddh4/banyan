import { z } from "zod";
import { metadata } from "../metadata.js";

export const embeddings = metadata.merge(
  z.object({
    event: z.literal("embeddings"),
    data: z.object({
      embeddings: z.record(z.string(), z.array(z.number())),
    }),
  }),
);
