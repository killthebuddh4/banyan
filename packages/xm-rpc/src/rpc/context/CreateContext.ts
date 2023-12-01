import { z } from "zod";
import { RpcContext } from "./RpcContext.js";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { rpcRequestSchema } from "../rpcRequestSchema.js";
import { Server } from "../../server/Server.js";

export type CreateContext = ({
  server,
  message,
  request,
}: {
  server: Server;
  message: DecodedMessage;
  request: z.infer<typeof rpcRequestSchema>;
}) => RpcContext;
