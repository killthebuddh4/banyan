import { Server } from "../server/Server.js";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { RpcRequest } from "./RpcRequest.js";
import { RpcResponse } from "./RpcResponse.js";

export type RpcHandler = ({
  server,
  message,
  request,
}: {
  server: Server;
  message: DecodedMessage;
  request: RpcRequest;
}) => Promise<RpcResponse>;
