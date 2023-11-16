import { Server } from "./Server.js";
import { MessageHandler } from "./MessageHandler.js";
import { v4 as uuid } from "uuid";

export const subscribe = ({
  toServer,
  usingHandler,
}: {
  toServer: Server;
  usingHandler: MessageHandler;
}) => {
  const id = uuid();
  toServer.handlers.set(id, usingHandler);
  return id;
};
