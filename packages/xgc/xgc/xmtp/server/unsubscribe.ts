import { Server } from "./Server.js";

export const unsubscribe = ({
  fromServer,
  handlerId,
}: {
  fromServer: Server;
  handlerId: string;
}) => {
  fromServer.handlers.delete(handlerId);
  return fromServer;
};
