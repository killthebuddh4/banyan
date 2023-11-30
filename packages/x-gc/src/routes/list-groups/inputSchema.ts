import { z } from "zod";

export const inputSchema = z.object({
  name: z.literal("listGroups"),
  arguments: z.object({}),
});
