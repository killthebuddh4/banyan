import { Server } from "./Server.js";

export const onNotStarted = ({ server }: { server: Server }) => {
  if (server.options?.onNotStarted === undefined) {
    // do nothing
  } else {
    server.options.onNotStarted();
  }
};
