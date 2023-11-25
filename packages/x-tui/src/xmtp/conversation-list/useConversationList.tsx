import { useSyncExternalStore } from "react";
import { Store } from "./Store.js";
import { createSubscribe } from "./createSubscribe.js";
import { getConversations } from "./getConversations.js";
import { setConversations } from "./setConversations.js";
import { Conversation } from "@xmtp/xmtp-js";

export const useConversationList = ({ store }: { store: Store }) => {
  const conversations = useSyncExternalStore(createSubscribe({ store }), () =>
    getConversations({ store }),
  );

  return {
    list: conversations,
    add: ({ conversations }: { conversations: Conversation[] }) =>
      setConversations({ store, conversations }),
  };
};
