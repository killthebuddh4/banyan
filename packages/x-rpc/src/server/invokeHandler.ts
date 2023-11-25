import { Server } from "./Server.js";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { Metadata } from "./Metadata.js";
import { getHandler } from "./getHandler.js";

export const invokeHandler = async ({
  server,
  metadata,
  message,
}: {
  server: Server;
  metadata: Metadata;
  message: DecodedMessage;
}) => {
  const handler = getHandler({ fromServer: server, withMetadata: metadata });

  for (const tracer of handler.tracers.values()) {
    tracer.onInput({ message });
  }

  const result = await handler.handler({
    client: server.client,
    metadata,
    message,
  });

  for (const tracer of handler.tracers.values()) {
    tracer.onOutput({ message: result });
  }

  return result;
};
