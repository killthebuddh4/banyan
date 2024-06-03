import { z } from "zod";

export const requestSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  payload: z.unknown(),
});
