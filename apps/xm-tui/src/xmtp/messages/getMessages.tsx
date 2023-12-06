import { Store } from "./Store.js";

export const getMessages = ({
  store,
  peerAddress,
}: {
  store: Store;
  peerAddress: string;
}) => {
  let messages = store.messages.get(peerAddress);

  if (messages === undefined) {
    store.messages.set(peerAddress, []);
  }

  messages = store.messages.get(peerAddress);

  if (messages === undefined) {
    throw new Error("messages is undefined even though we just set it");
  }

  return messages;
};
