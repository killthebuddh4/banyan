import { z } from "zod";

export const configSchema = z.object({
  privateKey: z.string(),
  remoteServerAddress: z.string(),
  aliases: z
    .array(z.object({ source: z.string(), alias: z.string() }))
    .optional()
    .default([]),
});
