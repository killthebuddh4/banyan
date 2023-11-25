import { DecodedMessage } from "@xmtp/xmtp-js";
import { Store } from "./Store.js";

export const setMessage = ({
  store,
  message,
}: {
  store: Store;
  message: DecodedMessage;
}) => {
  if (!store.index.has(message.conversation.peerAddress)) {
    store.index.set(message.conversation.peerAddress, new Map());
  }

  const subIndex = store.index.get(message.conversation.peerAddress);
  if (subIndex === undefined) {
    throw new Error("messages is undefined even though we just set it");
  }

  if (subIndex.has(message.id)) {
    return;
  }

  subIndex.set(message.id, message);
  store.messages.set(
    message.conversation.peerAddress,
    Array.from(subIndex.values()),
  );

  for (const handler of store.handlers.values()) {
    if (!handler.predicate({ message })) {
      continue;
    }
    handler.handler();
  }
};
