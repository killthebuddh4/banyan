import { Server } from "./Server.js";
import { Metadata } from "./Metadata.js";

export const onSubscriberCalled = ({
  server,
  metadata,
}: {
  server: Server;
  metadata: Metadata;
}) => {
  if (server.options?.onSubscriberCalled === undefined) {
    // do nothing
  } else {
    server.options.onSubscriberCalled({ metadata });
  }
};
