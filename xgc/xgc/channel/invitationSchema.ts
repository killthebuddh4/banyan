import { z } from "zod";

export const invitationSchema = z.object({
  toAddress: z.string(),
  status: z.enum(["pending", "accepted", "declined"]),
});
