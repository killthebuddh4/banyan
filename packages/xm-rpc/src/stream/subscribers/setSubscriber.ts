import { Subscriber } from "./Subscriber.js";
import { Store } from "./Store.js";

export const setSubscriber = ({
  store,
  clientAddress,
  subscriber,
}: {
  store: Store;
  clientAddress: string;
  subscriber: Subscriber;
}) => {
  const subscribers = store.get(clientAddress) ?? new Map();

  if (subscribers.has(subscriber.metadata.id)) {
    return;
  }

  subscribers.set(subscriber.metadata.id, subscriber);

  store.set(clientAddress, subscribers);
};
