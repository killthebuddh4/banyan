import { Server } from "./Server.js";

export const onUncaughtHandlerError = ({
  server,
  err,
}: {
  server: Server;
  err: unknown;
}) => {
  if (server.options?.onUncaughtHandlerError === undefined) {
    console.error(
      "Caught an uncaught handler error, but no handler was provided to handle it. You might want to",
    );
    console.error(
      "provide an `onUncaughtHandlerError` as an options to `start`.",
    );
  } else {
    server.options.onUncaughtHandlerError(err);
  }
};
