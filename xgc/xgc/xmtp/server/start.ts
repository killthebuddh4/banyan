import { Server } from "./Server.js";
import { cacheMessage } from "../cacheMessage.js";
import { getMessages } from "../getMessages.js";

export const start = async ({ server }: { server: Server }) => {
  if (server.stream !== null) {
    throw new Error("Server is already running");
  }

  const stream = await server.client.conversations.streamAllMessages();
  server.stream = stream;

  console.log(`SERVER IS STREAMING AT ${server.client.address}`);

  (async () => {
    for await (const message of stream) {
      cacheMessage({ message });
      try {
        for (const handler of server.handlers.values()) {
          handler({
            client: server.client,
            messages: getMessages({
              peerAddress: message.conversation.peerAddress,
            }),
          });
        }
      } catch (err) {
        console.error("CAUGHT AN UNCAUGHT ERROR WHILE HANDLING MESSAGE", err);
      }
    }
  })();

  return server;
};
