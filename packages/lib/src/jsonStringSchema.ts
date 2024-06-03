import { z } from "zod";

export const jsonStringSchema = z.string().transform((val, ctx) => {
  try {
    return JSON.parse(val);
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
    });

    return z.NEVER;
  }
});
