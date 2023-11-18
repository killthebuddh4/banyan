import { z } from "zod";
import { userSchema } from "./userSchema.js";
import { invitationSchema } from "./invitationSchema.js";
import { dateStringSchema } from "../lib/dateStringSchema.js";

export const channelDescriptionSchema = z.object({
  owner: userSchema,
  address: z.string(),
  createdAt: z.date().or(dateStringSchema),
  creator: userSchema,
  name: z.string(),
  description: z.string(),
  invitations: z.array(invitationSchema),
  members: z.array(userSchema),
});
