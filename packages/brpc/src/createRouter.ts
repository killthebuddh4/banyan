import * as Brpc from "./brpc.js";

export const createRouter = <A extends Brpc.BrpcApi>({
  api,
  router,
}: {
  api: A;
  router: Brpc.BrpcRouter<A>;
}): Brpc.BrpcRouter<A> => {
  return router;
};
