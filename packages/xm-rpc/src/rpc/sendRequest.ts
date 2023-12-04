import { z } from "zod";
import { Server } from "../server/Server.js";
import { rpcRequestSchema } from "./rpcRequestSchema.js";

export const sendRequest = async ({
  usingLocalServer,
  toAddress,
  request,
}: {
  usingLocalServer: Server;
  toAddress: string;
  request: z.infer<typeof rpcRequestSchema>;
}) => {
  console.log("SENDING A REQUEST");
  const conversation =
    await usingLocalServer.client.conversations.newConversation(toAddress, {
      conversationId: "xmtrpc",
      metadata: {},
    });
  return conversation.send(JSON.stringify(request));
};
