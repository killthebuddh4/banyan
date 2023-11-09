import { z } from "zod";
import { metadata } from "../metadata.js";

export const nodeError = metadata.merge(
  z.object({
    event: z.literal("node-error"),
  }),
);
