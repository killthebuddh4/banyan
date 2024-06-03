import { z } from "zod";

export const responseSchema = z.object({
  id: z.string().uuid(),
  payload: z.unknown(),
});
