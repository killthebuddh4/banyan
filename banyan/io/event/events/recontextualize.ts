import { z } from "zod";
import { metadata } from "../metadata.js";

export const recontextualize = metadata.merge(
  z.object({
    event: z.literal("recontextualize"),
    data: z.object({
      recontextualize: z.string(),
    }),
  }),
);
