import { z } from "zod";

export const signature = z.object({
  name: z.literal("inviteMemberToChannel"),
  arguments: z.object({
    memberAddress: z.string(),
    channelAddress: z.string(),
  }),
});
