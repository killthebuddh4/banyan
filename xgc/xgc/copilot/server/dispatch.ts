import { MessageHandler } from "../../xmtp/MessageHandler.js";
import { isCommandMessage } from "../superuser/isCommandMessage.js";
import { handleSuperuserMessage } from "./handleSuperuserMessage.js";
import { handleUserMessage } from "./handleUserMessage.js";

export const dispatch: MessageHandler = async ({ client, messages }) => {
  if (messages.length === 0) {
    throw new Error("No messages to dispatch inside the message dispatcher.");
  }

  if (isCommandMessage({ message: messages[messages.length - 1] })) {
    await handleSuperuserMessage({ client, messages });
  } else {
    await handleUserMessage({ client, messages });
  }
};
