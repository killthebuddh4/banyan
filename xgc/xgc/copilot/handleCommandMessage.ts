import { MessageHandler } from "../xmtp/MessageHandler.js";
import { getCommandFromMessage } from "../xmtp/getCommandFromMessage.js";
import { execCommand } from "./execCommand.js";
import { sendMessage } from "../xmtp/sendMessage.js";

export const handleCommandMessage: MessageHandler = async ({
  client,
  messages,
}) => {
  if (messages.length === 0) {
    throw new Error("No messages to handle inside the user message handler.");
  }

  const lastMessage = messages[messages.length - 1];

  if (lastMessage.senderAddress === client.address) {
    return;
  }

  const functionCall = getCommandFromMessage({ message: lastMessage });

  const commandResult = await execCommand({
    client,
    messages,
    functionCall,
  });

  console.log("COMMAND RESULT", commandResult);

  sendMessage({
    client,
    toAddress: lastMessage.senderAddress,
    content: JSON.stringify(commandResult, null, 2),
  });
};
