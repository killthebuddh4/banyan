import { Metadata } from "./Metadata.js";
import { Server } from "./Server.js";

export const getSubscriber = ({
  fromServer,
  withMetadata,
}: {
  fromServer: Server;
  withMetadata: Metadata;
}) => {
  const subscriber = fromServer.subscribers.get(withMetadata.id);

  if (subscriber === undefined) {
    throw new Error(`Subscriber ${withMetadata.id} does not exist`);
  }

  return subscriber;
};
