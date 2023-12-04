import { Server } from "./Server.js";
import { onNotStarted } from "./options/onNotStarted.js";

export const stop = ({ server }: { server: Server }) => {
  if (server.stream === null) {
    onNotStarted({ server });
  } else {
    server.stream.return();
    server.stream = null;
  }

  return server;
};
