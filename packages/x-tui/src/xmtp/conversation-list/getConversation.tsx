import { Store } from "./Store.js";

export const getConversation = ({
  store,
  peerAddress,
}: {
  store: Store;
  peerAddress: string;
}) => {
  return store.index.get(peerAddress);
};
