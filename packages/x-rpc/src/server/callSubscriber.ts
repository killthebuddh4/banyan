import { Server } from "./Server.js";
import { Subscriber } from "./Subscriber.js";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { onSubscriberCalled } from "./onSubscriberCalled.js";

export const callSubscriber = async ({
  server,
  subscriber,
  message,
}: {
  server: Server;
  subscriber: Subscriber;
  message: DecodedMessage;
}) => {
  const allow = await subscriber.filter({
    server,
    subscriber: subscriber.metadata,
    message,
  });

  if (!allow) {
    return;
  }

  onSubscriberCalled({ server, metadata: subscriber.metadata });

  return subscriber.handler({
    server,
    subscriber: subscriber.metadata,
    message,
  });
};
