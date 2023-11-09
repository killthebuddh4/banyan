import { z } from "zod";
import { metadata } from "../metadata.js";

export const nodeEnd = metadata.merge(
  z.object({
    event: z.literal("node-end"),
  }),
);
