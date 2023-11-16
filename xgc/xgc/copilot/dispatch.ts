import { isCommandMessage } from "../xmtp/isCommandMessage.js";
import { MessageHandler } from "../xmtp/server/MessageHandler.js";
import { handleCommandMessage } from "./handleCommandMessage.js";

export const dispatch: MessageHandler = async ({ client, messages }) => {
  const content = messages[messages.length - 1].content;
  if (isCommandMessage({ message: messages[messages.length - 1] })) {
    handleCommandMessage({ client, messages });
  } else {
    console.log("Copilot not yet implemented for non-command messages.");
  }
};
