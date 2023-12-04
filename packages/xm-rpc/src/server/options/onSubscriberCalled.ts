import { Server } from "../Server.js";
import { Subscriber } from "../Subscriber.js";

export const onSubscriberCalled = ({
  server,
  subscriber,
}: {
  server: Server;
  subscriber: Subscriber;
}) => {
  if (server.options?.onSubscriberCalled === undefined) {
    // do nothing
  } else {
    server.options.onSubscriberCalled({ subscriber });
  }
};
