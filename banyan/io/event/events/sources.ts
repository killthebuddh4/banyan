import { z } from "zod";
import { metadata } from "../metadata.js";

export const sources = metadata.merge(
  z.object({
    event: z.literal("sources"),
    data: z.object({
      sources: z.record(
        z.string(),
        z.array(
          z.object({
            id: z.string(),
            distance: z.number().nonnegative(),
            embeddedText: z.string(),
            textFromHtml: z.string(),
            pageUrl: z.string().url(),
          }),
        ),
      ),
    }),
  }),
);
