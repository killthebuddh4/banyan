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
  if (!store.has(clientAddress)) {
    store.set(clientAddress, new Map());
  }

  const subscribers = store.get(clientAddress);

  if (subscribers === undefined) {
    throw new Error("Subscribers should not be undefined, we just set it.");
  }

  if (subscribers.has(subscriber.metadata.id)) {
    throw new Error("Subscriber already exists");
  }

  subscribers.set(subscriber.metadata.id, subscriber);
};
