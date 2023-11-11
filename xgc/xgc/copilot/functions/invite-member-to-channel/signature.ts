import { z } from "zod";
import { jsonStringSchema } from "../../../lib/jsonStringSchema.js";

export const signature = z.object({
  name: z.literal("inviteMemberToChannel"),
  arguments: jsonStringSchema.pipe(
    z.object({
      memberAddress: z.string(),
      channelAddress: z.string(),
    }),
  ),
});
