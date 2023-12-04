import { Server } from "../Server.js";

export const onStreamBefore = ({ server }: { server: Server }) => {
  if (server.options?.onStream?.before === undefined) {
    // do nothing
  } else {
    server.options.onStream.before();
  }
};
