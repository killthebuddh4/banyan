import { DecodedMessage } from "@xmtp/xmtp-js";
import { messageCache } from "./messageCache.js";

export const cacheMessage = ({ message }: { message: DecodedMessage }) => {
  if (messageCache.length === 0) {
    messageCache.push(message);
  } else {
    for (let i = messageCache.length - 1; i >= 0; i--) {
      if (messageCache[i].id === message.id) {
        break;
      }

      if (messageCache[i].sent.getTime() < message.sent.getTime()) {
        messageCache.splice(i + 1, 0, message);
        break;
      }

      if (i === 0) {
        messageCache.unshift(message);
      }
    }
  }
};
