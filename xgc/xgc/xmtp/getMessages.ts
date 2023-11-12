import { messageCache } from "./messageCache.js";

// TODO: We don't handle conversationIds yet.
export const getMessages = ({ peerAddress }: { peerAddress: string }) => {
  return messageCache.filter((message) => {
    return message.conversation.peerAddress === peerAddress;
  });
};
