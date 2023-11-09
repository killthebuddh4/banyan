import { z } from "zod";
import { metadata } from "../metadata.js";

export const nodeClose = metadata.merge(
  z.object({
    event: z.literal("node-close"),
  }),
);
