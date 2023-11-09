import { z } from "zod";
import { metadata } from "../metadata.js";

export const decomposed = metadata.merge(
  z.object({
    event: z.literal("decomposed"),
    data: z.object({
      decomposed: z.array(z.string()),
    }),
  }),
);
