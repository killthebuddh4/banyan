import { CONFIG } from "./CONFIG.js";
import { DecodedMessage } from "@xmtp/xmtp-js";

export const isCommandMessage = ({ message }: { message: DecodedMessage }) => {
  if (message.senderAddress !== CONFIG.superuserAddress) {
    return false;
  }

  if (!CONFIG.commands.includes(message.content)) {
    return false;
  }

  return true;
};
