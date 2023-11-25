import { Server } from "./Server.js";

export const onAlreadyRunning = ({ server }: { server: Server }) => {
  if (server.options?.onAlreadyRunning === undefined) {
    // do nothing
  } else {
    server.options.onAlreadyRunning();
  }
};
