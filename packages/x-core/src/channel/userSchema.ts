import { z } from "zod";

export const userSchema = z.object({
  address: z.string(),
});
