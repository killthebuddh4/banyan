import { z } from "zod";
import { metadata } from "../metadata.js";

export const empty = metadata.merge(
  z.object({
    event: z.literal("empty"),
  }),
);
