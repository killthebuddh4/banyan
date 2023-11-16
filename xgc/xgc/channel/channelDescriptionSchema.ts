import { z } from "zod";
import { userSchema } from "./userSchema.js";
import { invitationSchema } from "./invitationSchema.js";

export const channelDescriptionSchema = z.object({
  owner: userSchema,
  address: z.string(),
  createdAt: z.number(),
  creator: userSchema,
  name: z.string(),
  description: z.string(),
  invitations: z.array(invitationSchema),
  members: z.array(userSchema),
});
