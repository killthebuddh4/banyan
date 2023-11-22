import { z } from "zod";

const ethAddressSchema = z.string().superRefine((s, ctx) => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(s)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid Ethereum address",
    });

    return z.NEVER;
  }

  return s;
});

export const isSource = ({ maybeSource }: { maybeSource: string }) =>
  ethAddressSchema.safeParse(maybeSource).success;
