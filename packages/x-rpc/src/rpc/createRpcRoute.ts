import { z } from "zod";
import { RpcRoute } from "./RpcRoute.js";

export const createRpcRoute = <I extends z.ZodTypeAny, O extends z.ZodTypeAny>({
  address,
  method,
  inputSchema,
  outputSchema,
  handler,
}: {
  address: string;
  method: string;
  inputSchema: I;
  outputSchema: O;
  handler: (input: z.infer<I>) => Promise<z.infer<O>>;
}): RpcRoute<typeof inputSchema, typeof outputSchema> => {
  return {
    address,
    inputSchema,
    outputSchema,
    method,
    handler,
  };
};
