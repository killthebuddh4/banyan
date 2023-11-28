import { z } from "zod";

export const inputSchema = z.object({
  name: z.literal("removeMemberFromChannel"),
  arguments: z.object({
    memberAddress: z.string(),
    channelAddress: z.string(),
  }),
});
