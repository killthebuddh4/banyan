import { z } from "zod";
import { rpcRequestSchema } from "./rpcRequestSchema.js";
import { Client } from "@xmtp/xmtp-js";

export const sendRequest = async ({
  client,
  toAddress,
  request,
}: {
  client: Client;
  toAddress: string;
  request: z.infer<typeof rpcRequestSchema>;
}) => {
  console.log("SENDING A REQUEST");
  const conversation = await client.conversations.newConversation(toAddress, {
    conversationId: "xmtrpc",
    metadata: {},
  });
  return conversation.send(JSON.stringify(request));
};
