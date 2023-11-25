import { z } from "zod";

export const optionsSchema = z.object({
  config: z.string(),
  peerAddress: z.string().optional(),
});
