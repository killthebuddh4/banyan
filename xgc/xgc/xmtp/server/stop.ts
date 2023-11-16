import { Server } from "./Server.js";

export const stop = ({ server }: { server: Server }) => {
  const stream = server.stream;
  if (stream === null) {
    throw new Error("Server is not running");
  }
  server.stream = null;
  stream.return();
  return server;
};
