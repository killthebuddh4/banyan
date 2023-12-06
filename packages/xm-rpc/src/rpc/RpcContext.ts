import { z } from "zod";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { rpcRequestSchema } from "./rpcRequestSchema.js";
import { Client } from "@xmtp/xmtp-js";

export type RpcContext = {
  client: Client;
  message: DecodedMessage;
  request: z.infer<typeof rpcRequestSchema>;
};
