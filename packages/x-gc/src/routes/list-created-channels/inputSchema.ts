import { z } from "zod";

export const inputSchema = z.object({
  name: z.literal("listCreatedChannels"),
  arguments: z.object({}),
});
