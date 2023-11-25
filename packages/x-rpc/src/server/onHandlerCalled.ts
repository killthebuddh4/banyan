import { Server } from "./Server.js";
import { Metadata } from "./Metadata.js";

export const onHandlerCalled = ({
  server,
  metadata,
}: {
  server: Server;
  metadata: Metadata;
}) => {
  if (server.options?.onHandlerCalled === undefined) {
    // do nothing
  } else {
    server.options.onHandlerCalled({ metadata });
  }
};
