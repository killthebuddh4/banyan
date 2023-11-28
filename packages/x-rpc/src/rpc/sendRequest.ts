import { z } from "zod";
import { Server } from "../server/Server.js";
import { rpcRequestSchema } from "./rpcRequestSchema.js";
import { RpcRoute } from "./RpcRoute.js";

export const sendRequest = async ({
  usingLocalServer,
  toRoute,
  request,
}: {
  usingLocalServer: Server;
  toRoute: RpcRoute<any, any>;
  request: z.infer<typeof rpcRequestSchema>;
}) => {
  const conversation =
    await usingLocalServer.client.conversations.newConversation(
      toRoute.address,
    );
  return conversation.send(JSON.stringify(request));
};
