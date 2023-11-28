import { z } from "zod";

export type RpcRoute<
  I extends z.ZodTypeAny = any,
  O extends z.ZodTypeAny = any,
> = {
  inputSchema: I;
  outputSchema: O;
  method: string;
  handler: (input: I) => Promise<z.infer<O>>;
};
