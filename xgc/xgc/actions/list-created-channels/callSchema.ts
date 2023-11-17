import { z } from "zod";

export const callSchema = z.object({
  name: z.literal("listCreatedChannels"),
  arguments: z.object({}),
});
