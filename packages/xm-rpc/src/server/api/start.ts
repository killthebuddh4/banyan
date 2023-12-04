import { Server } from "../Server.js";
import { onStreamBefore } from "../options/onStreamBefore.js";
import { onStreamSuccess } from "../options/onStreamSuccess.js";
import { onStreamError } from "../options/onStreamError.js";
import { onAlreadyRunning } from "../options/onAlreadyRunning.js";
import { onUncaughtHandlerError } from "../options/onUncaughtHandlerError.js";
import { onMessageReceived } from "../options/onMessageReceived.js";
import { onSubscriberCalled } from "../options/onSubscriberCalled.js";
import { stop } from "../stop.js";

export const start = async ({ server }: { server: Server }) => {
  if (server.stream !== null) {
    onAlreadyRunning({ server });
    return () => {
      stop({ server });
    };
  }

  onStreamBefore({ server });

  let stream: (typeof server)["stream"];
  try {
    stream = await server.client.conversations.streamAllMessages();
  } catch (err) {
    onStreamError({ server, err });
    throw new Error("Failed to start server");
  }

  onStreamSuccess({ server });

  server.stream = stream;

  (async () => {
    for await (const message of stream) {
      if (message.senderAddress === server.client.address) {
        continue;
      }

      onMessageReceived({ server, message });

      try {
        for (const subscriber of server.subscribers.values()) {
          onSubscriberCalled({ server, subscriber });

          subscriber.handler(message);
        }
      } catch (err) {
        onUncaughtHandlerError({ server, err });
      }
    }
  })();

  /* TODO, We need to instrument the stopping logic with a way to notify all
   * subscribers. */
  return () => {
    stop({ server });
  };
};
