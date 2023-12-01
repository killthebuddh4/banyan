import { z } from "zod";

export const withIdSchema = z.object({
  id: z.string(),
});
