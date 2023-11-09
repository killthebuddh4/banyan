import { z } from "zod";
import { metadata } from "../metadata.js";

export const integrated = metadata.merge(
  z.object({
    event: z.literal("integrated"),
    data: z.object({
      integrated: z.any(),
    }),
  }),
);
