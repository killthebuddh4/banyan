import { z } from "zod";

export const optionsSchema = z.object({
  privateKey: z.string(),
  peerAddress: z.string().optional(),
});
