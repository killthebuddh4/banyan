import { useSyncExternalStore, useCallback } from "react";
import { Store } from "./Store.js";
import { createSubscribe } from "./createSubscribe.js";
import { getStream } from "./getStream.js";
import { setStream } from "./setStream.js";
import { Client } from "@xmtp/xmtp-js";
export const useStream = ({ store }: { store: Store }) => {
  const stream = useSyncExternalStore(createSubscribe({ store }), () =>
    getStream({ store }),
  );

  const start = useCallback(
    ({ client }: { client: Client }) => {
      if (stream !== undefined) {
        return;
      }

      (async () => {
        const stream = await client.conversations.stream();
        setStream({ store, stream });
      })();
    },
    [stream],
  );

  return { stream, start };
};
