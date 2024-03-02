import { Subscriber } from "./Subscriber.js";
import { Store } from "./Store.js";

export const deleteSubscriber = ({
  store,
  clientAddress,
  subscriberId,
}: {
  store: Store;
  clientAddress: string;
  subscriberId: string;
}) => {
  const subscribers = store.get(clientAddress);

  if (subscribers === undefined) {
    // do nothing
  } else {
    subscribers.delete(subscriberId);
  }
};
