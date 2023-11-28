import { z } from "zod";
import { Server } from "../server/Server.js";
import { rpcRequestSchema } from "./rpcRequestSchema.js";
import { RpcRoute } from "./RpcRoute.js";

export const sendRequest = async ({
  usingLocalServer,
  toAddress,
  request,
}: {
  usingLocalServer: Server;
  toAddress: string;
  request: z.infer<typeof rpcRequestSchema>;
}) => {
  const conversation =
    await usingLocalServer.client.conversations.newConversation(toAddress);
  return conversation.send(JSON.stringify(request));
};
