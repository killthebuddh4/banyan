import { z } from "zod";
import * as Brpc from "./brpc.js";

export const createProcedure = <
  I extends z.ZodTypeAny,
  O extends z.ZodTypeAny,
>(args: {
  input: I;
  output: O;
  acl: Brpc.BrpcAcl;
  handler: ({
    context,
    input,
  }: {
    context: Brpc.BrpcContext;
    input: z.infer<I>;
  }) => Promise<z.infer<O>>;
}): Brpc.BrpcProcedure<typeof args.input, typeof args.output> => {
  return args;
};
