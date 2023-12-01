import { z } from "zod";
import { RpcRoute } from "../RpcRoute.js";
import { RpcContext } from "../context/RpcContext.js";
import { CreateContext } from "../context/CreateContext.js";

export const createRoute = <I extends z.ZodTypeAny, O extends z.ZodTypeAny>({
  createContext,
  method,
  inputSchema,
  outputSchema,
  handler,
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
}): RpcRoute<typeof inputSchema, typeof outputSchema> => {
  return {
    createContext,
    inputSchema,
    outputSchema,
    method,
    handler,
  };
};
