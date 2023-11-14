import { cacheMessage } from "./cacheMessage.js";
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
  const sent = await conversation.send(content);
  console.log("SENT XMTP FROM ", client.address, " TO ", toAddress);
  cacheMessage({ message: sent });
  return sent;
};
