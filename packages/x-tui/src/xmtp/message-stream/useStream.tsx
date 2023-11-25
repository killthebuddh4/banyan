import { Store } from "./Store.js";
import { useSyncExternalStore, useCallback } from "react";
import { createSubscribe } from "./createSubscribe.js";
import { getStream } from "./getStream.js";
import { setStream } from "./setStream.js";
import { Client } from "@xmtp/xmtp-js";

export const useStream = ({
  store,
  forPeerAddress,
}: {
  store: Store;
  forPeerAddress: string;
}) => {
  const stream = useSyncExternalStore(
    createSubscribe({
      store,
      predicate: ({ peerAddress }) => peerAddress === forPeerAddress,
    }),
    () => getStream({ store, peerAddress: forPeerAddress }),
  );

  const start = useCallback(
    ({ client }: { client: Client }) => {
      if (stream !== undefined) {
        return;
      }

      (async () => {
        const conversation =
          await client.conversations.newConversation(forPeerAddress);
        const stream = await conversation.streamMessages();
        setStream({ store, peerAddress: forPeerAddress, stream });
      })();
    },
    [stream],
  );

  return { stream, start };
};
