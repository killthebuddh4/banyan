import { Store } from "./Store.js";
import crypto from "crypto";

export const createSubscribe = ({
  store,
  predicate,
}: {
  store: Store;
  predicate: ({ peerAddress }: { peerAddress: string }) => boolean;
}) => {
  return (handler: () => void) => {
    const id = crypto.randomUUID();
    store.handlers.set(id, { predicate, handler });
    return () => store.handlers.delete(id);
  };
};
