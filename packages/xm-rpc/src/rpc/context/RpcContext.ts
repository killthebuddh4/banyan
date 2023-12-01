import { z } from "zod";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { rpcRequestSchema } from "../rpcRequestSchema.js";
import { Server } from "../../server/Server.js";

export type RpcContext = {
  server: Server;
  message: DecodedMessage;
  request: z.infer<typeof rpcRequestSchema>;
};
