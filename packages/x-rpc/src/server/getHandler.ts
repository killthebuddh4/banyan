import { Metadata } from "./Metadata.js";
import { Server } from "./Server.js";

export const getHandler = ({
  fromServer,
  withMetadata,
}: {
  fromServer: Server;
  withMetadata: Metadata;
}) => {
  const handler = fromServer.handlers.get(withMetadata.handler.id);

  if (handler === undefined) {
    throw new Error(`Handler ${withMetadata.handler.id} does not exist`);
  }

  return handler;
};
