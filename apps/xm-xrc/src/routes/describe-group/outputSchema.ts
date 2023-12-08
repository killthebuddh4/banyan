import { z } from "zod";
import { dateStringSchema } from "xm-lib/util/dateStringSchema.js";

const successSchema = z.object({
  ok: z.literal(true),
  result: z.object({
    description: z.object({
      address: z.string(),
      owner: z.object({
        address: z.string(),
      }),
      creator: z.object({
        address: z.string(),
      }),
      createdAt: z.date().or(dateStringSchema),
      name: z.string(),
      description: z.string(),
      invitations: z.array(
        z.object({
          invitedUser: z.object({
            address: z.string(),
          }),
          invitedByUser: z.object({
            address: z.string(),
          }),
          status: z.string(),
        }),
      ),
      members: z.array(
        z.object({
          address: z.string(),
        }),
      ),
    }),
  }),
});

const failureSchema = z.object({
  ok: z.boolean(),
  result: z.object({
    message: z.string(),
  }),
});

export const outputSchema = z.union([successSchema, failureSchema]);
