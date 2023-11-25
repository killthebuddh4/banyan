import { Server } from "../Server.js";
import { Metadata } from "../Metadata.js";
import { MessageHandler } from "../MessageHandler.js";
import { unsubscribe } from "../unsubscribe.js";

export const subscribe = ({
  toServer,
  withMetadata,
  usingHandler,
  options,
}: {
  toServer: Server;
  withMetadata: Metadata;
  usingHandler: MessageHandler;
  options?: {
    overrideExistingHandler?: boolean;
  };
}) => {
  if (toServer.handlers.has(withMetadata.handler.id)) {
    if (options?.overrideExistingHandler === true) {
      // do nothing
    } else {
      throw new Error(
        `A handler with the id ${withMetadata.handler.id} has already subscribed to the server`,
      );
    }
  }

  toServer.handlers.set(withMetadata.handler.id, {
    metadata: withMetadata,
    handler: usingHandler,
    tracers: new Map(),
  });

  return () => {
    unsubscribe({
      fromServer: toServer,
      handlerId: withMetadata.handler.id,
    });
  };
};
