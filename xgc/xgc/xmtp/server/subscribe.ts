import { Server } from "./Server.js";
import { MessageHandler } from "./MessageHandler.js";

export const subscribe = ({
  handlerId,
  toServer,
  usingHandler,
}: {
  handlerId: string;
  toServer: Server;
  usingHandler: MessageHandler;
}) => {
  const existingHandler = toServer.handlers.get(handlerId);
  if (existingHandler !== undefined) {
    throw new Error(
      `A handler with the id ${handlerId} has already subscribed to the server`,
    );
  }
  toServer.handlers.set(handlerId, usingHandler);
};
