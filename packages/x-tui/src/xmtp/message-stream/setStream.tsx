import { Store } from "./Store.js";
import { Stream, DecodedMessage } from "@xmtp/xmtp-js";

export const setStream = ({
  store,
  peerAddress,
  stream,
}: {
  store: Store;
  peerAddress: string;
  stream: Stream<DecodedMessage>;
}) => {
  if (store.streams.has(peerAddress)) {
    return;
  }

  store.streams.set(peerAddress, stream);

  for (const handler of store.handlers.values()) {
    if (!handler.predicate({ peerAddress })) {
      continue;
    }
    handler.handler();
  }
};
