import { z } from "zod";
import { metadata } from "../metadata.js";

export const nodeStart = metadata.merge(
  z.object({
    event: z.literal("node-start"),
  }),
);
