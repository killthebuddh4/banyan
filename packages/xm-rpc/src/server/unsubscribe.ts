import { Server } from "./Server.js";

export const unsubscribe = ({
  fromServer,
  subscriberId,
}: {
  fromServer: Server;
  subscriberId: string;
}) => {
  if (!fromServer.subscribers.has(subscriberId)) {
    throw new Error(`Subscriber ${subscriberId} does not exist`);
  }

  fromServer.subscribers.delete(subscriberId);

  return fromServer;
};
