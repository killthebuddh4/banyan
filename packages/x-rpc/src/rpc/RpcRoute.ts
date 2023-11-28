import { z } from "zod";

export type RpcRoute<I extends z.ZodTypeAny, O extends z.ZodTypeAny> = {
  address: string;
  inputSchema: I;
  outputSchema: O;
  method: string;
  handler: (input: z.infer<I>) => Promise<z.infer<O>>;
};
