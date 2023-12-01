import { RpcContext } from "./context/RpcContext.js";

export type RpcHandler<I, O> = ({
  context,
  input,
}: {
  context: RpcContext;
  input: I;
}) => Promise<O>;
