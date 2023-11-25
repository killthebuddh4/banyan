import { Conversation } from "@xmtp/xmtp-js";
import { Store } from "./Store.js";

export const setConversations = ({
  store,
  conversations,
}: {
  store: Store;
  conversations: Conversation[];
}) => {
  for (const conversation of conversations) {
    if (store.index.has(conversation.peerAddress)) {
      continue;
    }

    store.index.set(conversation.peerAddress, conversation);
  }

  store.conversations = Array.from(store.index.values());

  for (const handler of store.handlers.values()) {
    handler();
  }
};
