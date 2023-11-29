import { z } from "zod";

export const inputSchema = z.object({
  name: z.string(),
  arguments: z.object({}),
});
