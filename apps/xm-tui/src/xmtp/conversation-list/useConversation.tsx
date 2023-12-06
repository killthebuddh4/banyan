import { useSyncExternalStore } from "react";
import { Store } from "./Store.js";
import { createSubscribe } from "./createSubscribe.js";
import { getConversation } from "./getConversation.js";

export const useConversation = ({
  store,
  peerAddress,
}: {
  store: Store;
  peerAddress: string;
}) => {
  const conversation = useSyncExternalStore(createSubscribe({ store }), () =>
    getConversation({ store, peerAddress }),
  );

  return { conversation };
};
