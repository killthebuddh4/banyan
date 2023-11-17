import { z } from "zod";

export const callSchema = z.object({
  name: z.literal("removeMemberFromChannel"),
  arguments: z.object({
    memberAddress: z.string(),
    channelAddress: z.string(),
  }),
});
