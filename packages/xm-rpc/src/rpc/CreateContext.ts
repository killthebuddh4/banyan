import { z } from "zod";
import { RpcContext } from "./RpcContext.js";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { rpcRequestSchema } from "./rpcRequestSchema.js";
import { Client } from "@xmtp/xmtp-js";

export type CreateContext = ({
  client,
  message,
  request,
}: {
  client: Client;
  message: DecodedMessage;
  request: z.infer<typeof rpcRequestSchema>;
}) => RpcContext;
