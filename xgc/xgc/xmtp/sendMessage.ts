import { Client } from "@xmtp/xmtp-js";

export const sendMessage = async ({
  client,
  content,
  toAddress,
}: {
  client: Client;
  content: string;
  toAddress: string;
}) => {
  const conversation = await client.conversations.newConversation(toAddress);
  return conversation.send(content);
};
