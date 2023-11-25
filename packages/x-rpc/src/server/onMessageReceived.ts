import { Server } from "./Server.js";
import { DecodedMessage } from "@xmtp/xmtp-js";

export const onMessageReceived = ({
  server,
  message,
}: {
  server: Server;
  message: DecodedMessage;
}) => {
  if (server.options?.onMessageReceived === undefined) {
    // do nothing
  } else {
    server.options.onMessageReceived({ message });
  }
};
