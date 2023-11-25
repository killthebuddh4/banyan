import { Server } from "../Server.js";
import { onStreamBefore } from "../onStreamBefore.js";
import { onStreamSuccess } from "../onStreamSuccess.js";
import { onStreamError } from "../onStreamError.js";
import { onAlreadyRunning } from "../onAlreadyRunning.js";
import { onUncaughtHandlerError } from "../onUncaughtHandlerError.js";
import { onMessageReceived } from "../onMessageReceived.js";
import { onHandlerCalled } from "../onHandlerCalled.js";
import { invokeHandler } from "../invokeHandler.js";
import { stop } from "../stop.js";

export const start = async ({ server }: { server: Server }) => {
  if (server.stream !== null) {
    onAlreadyRunning({ server });
    return server;
  }

  onStreamBefore({ server });

  let stream: (typeof server)["stream"];
  try {
    stream = await server.client.conversations.streamAllMessages();
  } catch (err) {
    return onStreamError({ server, err });
  }

  onStreamSuccess({ server });

  server.stream = stream;

  (async () => {
    for await (const message of stream) {
      onMessageReceived({ server, message });

      try {
        for (const handler of server.handlers.values()) {
          onHandlerCalled({ server, metadata: handler.metadata });

          invokeHandler({
            server,
            metadata: handler.metadata,
            message,
          });
        }
      } catch (err) {
        onUncaughtHandlerError({ server, err });
      }
    }
  })();

  return () => {
    stop({ server });
  };
};
