import * as Brpc from "./brpc.js";

export const createApi = <A extends Brpc.BrpcApi>(api: A): typeof api => {
  return api;
};
