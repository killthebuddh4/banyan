import { z } from "zod";
import { CreateContext } from "./CreateContext.js";
import { RpcHandler } from "./RpcHandler.js";

export type RpcRoute<I extends z.ZodTypeAny, O extends z.ZodTypeAny> = {
  createContext: CreateContext;
  inputSchema: I;
  outputSchema: O;
  method: string;
  handler: RpcHandler<z.infer<I>, z.infer<O>>;
  options?: {
    mode: "stream" | "function";
  };
};
