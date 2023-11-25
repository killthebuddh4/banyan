import { RpcOptions } from "../RpcOptions.js";
import { Server } from "../../server/Server.js";
import { RpcServer } from "../RpcServer.js";

export const create = ({
  usingServer,
  rpcOptions,
}: {
  usingServer: Server;
  rpcOptions?: RpcOptions;
}): RpcServer => {
  return {
    server: usingServer,
    options: rpcOptions || {},
  };
};
