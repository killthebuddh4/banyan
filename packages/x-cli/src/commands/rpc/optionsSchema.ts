import { z } from "zod";

export const optionsSchema = z.object({
  server: z.string(),
  method: z.string(),
  args: z.string(),
});
