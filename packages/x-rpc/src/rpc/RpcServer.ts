import { RpcOptions } from "./RpcOptions.js";
import { Server } from "../server/Server.js";

export type RpcServer = {
  server: Server;
  options: RpcOptions;
};
