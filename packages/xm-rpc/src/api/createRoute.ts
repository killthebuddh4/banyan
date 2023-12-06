import { z } from "zod";
import { RpcRoute } from "../rpc/RpcRoute.js";
import { RpcContext } from "../rpc/RpcContext.js";
import { CreateContext } from "../rpc/CreateContext.js";

export const createRoute = <I extends z.ZodTypeAny, O extends z.ZodTypeAny>({
  createContext,
  method,
  inputSchema,
  outputSchema,
  handler,
  options,
}: {
  createContext: CreateContext;
  method: string;
  inputSchema: I;
  outputSchema: O;
  handler: ({
    context,
    input,
  }: {
    context: RpcContext;
    input: z.infer<I>;
  }) => Promise<z.infer<O>>;
  options?: {
    mode: "stream" | "function";
  };
}): RpcRoute<typeof inputSchema, typeof outputSchema> => {
  return {
    createContext,
    inputSchema,
    outputSchema,
    method,
    handler,
    options,
  };
};
