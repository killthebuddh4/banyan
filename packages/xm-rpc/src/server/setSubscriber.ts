import { Server } from "./Server.js";
import { Subscriber } from "./Subscriber.js";

export const setSubscriber = ({
  server,
  subscriber,
}: {
  server: Server;
  subscriber: Subscriber;
}) => {
  if (server.subscribers.has(subscriber.metadata.id)) {
    throw new Error(
      `Subscriber with id "${subscriber.metadata.id}" already exists`,
    );
  }

  server.subscribers.set(subscriber.metadata.id, subscriber);

  return server;
};
