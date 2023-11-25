import { Store } from "./Store.js";

export const getStream = ({
  store,
  peerAddress,
}: {
  store: Store;
  peerAddress: string;
}) => {
  return store.streams.get(peerAddress);
};
