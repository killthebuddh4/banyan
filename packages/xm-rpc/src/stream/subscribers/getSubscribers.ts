import { Store } from "./Store.js";

export const getSubscribers = ({
  store,
  clientAddress,
}: {
  store: Store;
  clientAddress: string;
}) => {
  let subscribers = store.get(clientAddress);

  if (!subscribers) {
    store.set(clientAddress, new Map());
  }

  subscribers = store.get(clientAddress);

  if (subscribers === undefined) {
    throw new Error("Subscribers should not be undefined, we just set it.");
  }

  return subscribers;
};
