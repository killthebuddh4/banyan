import { Server } from "../Server.js";
import { unsubscribe } from "../unsubscribe.js";
import { Subscriber } from "../Subscriber.js";

export const subscribe = ({
  toServer,
  subscriber,
  options,
}: {
  toServer: Server;
  subscriber: Subscriber;
  options?: {
    overrideExistingHandler?: boolean;
  };
}) => {
  if (toServer.subscribers.has(subscriber.metadata.id)) {
    if (options?.overrideExistingHandler === true) {
      // do nothing
    } else {
      throw new Error(
        `A handler with the id ${subscriber.metadata.id} has already subscribed to the server`,
      );
    }
  }

  toServer.subscribers.set(subscriber.metadata.id, subscriber);

  return () => {
    unsubscribe({
      fromServer: toServer,
      subscriberId: subscriber.metadata.id,
    });
  };
};
