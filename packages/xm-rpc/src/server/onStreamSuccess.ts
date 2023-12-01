import { Server } from "./Server.js";

export const onStreamSuccess = ({ server }: { server: Server }) => {
  if (server.options?.onStream?.success === undefined) {
    // do nothing
  } else {
    server.options.onStream.success();
  }
};
