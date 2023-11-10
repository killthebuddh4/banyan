import { DecodedMessage } from "@xmtp/xmtp-js";
import { CONFIG } from "./CONFIG.js";
import { messageStore } from "./messageStore.js";

export const addMessage = ({
  peerAddress,
  message,
}: {
  peerAddress: string;
  message: DecodedMessage;
}) => {
  if (message.conversation.peerAddress !== peerAddress) {
    throw new Error("Message peer address does not match");
  }

  const messages = [
    ...(messageStore.get(message.conversation.peerAddress) ?? []),
  ];

  if (messages.length === CONFIG.maxMessagesPerAddress) {
    messages.shift();
  }

  if (messages.length === 0) {
    messages.push(message);
  } else {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].id === message.id) {
        break;
      }

      if (messages[i].sent.getTime() < message.sent.getTime()) {
        messages.splice(i + 1, 0, message);
        break;
      }

      if (i === 0) {
        messages.unshift(message);
      }
    }
  }

  messageStore.set(message.conversation.peerAddress, messages);
};
