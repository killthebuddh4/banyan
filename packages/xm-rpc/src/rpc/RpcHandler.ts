import { RpcContext } from "./RpcContext.js";

export type RpcHandler<I, O> = ({
  context,
  input,
}: {
  context: RpcContext;
  input: I;
}) => Promise<O>;
