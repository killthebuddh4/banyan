import * as Brpc from "./brpc.js";

export const createApi = <A extends Brpc.BrpcSpec>({
  spec,
  api,
}: {
  spec: A;
  api: Brpc.BrpcApi<A>;
}): Brpc.BrpcApi<A> => {
  return api;
};
