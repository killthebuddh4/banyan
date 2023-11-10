import { z } from "zod";

export const signature = z.object({
  name: z.literal("removeMemberFromChannel"),
  arguments: z.object({
    memberAddress: z.string(),
    channelAddress: z.string(),
  }),
});
