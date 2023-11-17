import { z } from "zod";

export const dateStringSchema = z.string().transform((val, ctx) => {
  const date = new Date(val);

  if (date.toString() === "Invalid Date") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid date string",
    });
  }

  return date;
});
