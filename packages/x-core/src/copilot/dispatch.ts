import { MessageHandler } from "../xmtp/server/MessageHandler.js";
import { callSchema } from "../actions/callSchema.js";
import { sendMessage } from "../xmtp/sendMessage.js";
import { execCommand } from "./execCommand.js";
import { createReply } from "../xmtp/server/createReply.js";

export const dispatch: MessageHandler = async ({
  client,
  content,
  requestId,
  message,
}) => {
  const command = callSchema.safeParse(content);
  if (command.success) {
    console.log("DISPATCH GOT COMMAND", command.data);
    const commandResult = await execCommand({
      client,
      message,
      functionCall: command.data,
    });

    const reply = createReply({
      toRequestId: requestId,
      withContent: commandResult,
    });

    sendMessage({
      client,
      toAddress: message.senderAddress,
      content: reply,
    });
  } else {
    console.log("NON-COMMAND MESSAGE");
    console.log(message.content);
    console.log("NON-COMMAND MESSAGE");
  }
};
