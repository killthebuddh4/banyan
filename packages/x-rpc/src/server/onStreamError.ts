import { Server } from "./Server.js";

export const onStreamError = ({
  server,
  err,
}: {
  server: Server;
  err: unknown;
}) => {
  if (server.options?.onStream?.error === undefined) {
    // do nothing
  } else {
    server.options.onStream.error(err);
  }
};
