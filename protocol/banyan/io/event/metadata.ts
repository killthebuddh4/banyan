import { z } from "zod";

export const metadata = z.object({
  event: z.string(),
  id: z.string(),
  channel: z.string(),
  timestamp: z.number().positive(),
  metadata: z.unknown().optional(),
  data: z.unknown(),
});
