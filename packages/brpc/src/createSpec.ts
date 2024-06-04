import * as Brpc from "./brpc.js";

export const createSpec = <A extends Brpc.BrpcSpec>(spec: A): typeof spec => {
  return spec;
};
