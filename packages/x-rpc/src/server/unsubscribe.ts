import { Server } from "./Server.js";

export const unsubscribe = ({
  fromServer,
  handlerId,
}: {
  fromServer: Server;
  handlerId: string;
}) => {
  if (!fromServer.handlers.has(handlerId)) {
    throw new Error(`Handler ${handlerId} does not exist`);
  }

  fromServer.handlers.delete(handlerId);

  return fromServer;
};
