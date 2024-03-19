import { useSyncExternalStore } from "react";
import { Store } from "./Store.js";
import { getMessages } from "./getMessages.js";
import { createSubscribe } from "./createSubscribe.js";
import { setMessage } from "./setMessage.js";
import { DecodedMessage } from "@xmtp/xmtp-js";

export const useMessages = ({
  store,
  forPeerAddress,
}: {
  store: Store;
  forPeerAddress: string;
}) => {
  const messages = useSyncExternalStore(
    createSubscribe({
      store,
      predicate: ({ message }) =>
        message.conversation.peerAddress === forPeerAddress,
    }),
    () => getMessages({ store, peerAddress: forPeerAddress }),
  );

  return {
    messages,
    set: ({ message }: { message: DecodedMessage }) =>
      setMessage({ store, message }),
  };
};
