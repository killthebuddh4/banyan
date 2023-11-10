import { messageStore } from "./messageStore.js";

export const getMessages = ({ peerAddress }: { peerAddress: string }) => {
  return messageStore.get(peerAddress) ?? [];
};
