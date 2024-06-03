import { z } from "zod";

export const jsonStringableSchema = z.unknown().transform((val, ctx) => {
  try {
    return JSON.stringify(val);
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
    });

    return z.NEVER;
  }
});
