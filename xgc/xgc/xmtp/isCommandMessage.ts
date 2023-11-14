import { DecodedMessage } from "@xmtp/xmtp-js";
import { getCommandFromMessage } from "./getCommandFromMessage.js";

export const isCommandMessage = ({ message }: { message: DecodedMessage }) => {
  try {
    getCommandFromMessage({ message });
    return true;
  } catch {
    return false;
  }
};
