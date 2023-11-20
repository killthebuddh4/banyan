import { Server } from "./Server.js";
import { requestSchema } from "../client/requestSchema.js";

export const start = async ({ server }: { server: Server }) => {
  if (server.stream !== null) {
    throw new Error("Server is already running");
  }

  const stream = await server.client.conversations.streamAllMessages();
  server.stream = stream;

  console.log(`SERVER IS STREAMING AT ${server.client.address}`);

  (async () => {
    for await (const message of stream) {
      if (message.senderAddress === server.client.address) {
        continue;
      }

      const parsed = requestSchema.safeParse(message.content);
      if (!parsed.success) {
        console.log(
          "IGNORING A NON-REQUEST MESSAGE FROM ",
          message.senderAddress,
        );
        continue;
      }

      try {
        for (const handler of server.handlers.values()) {
          handler({
            client: server.client,
            message,
            requestId: parsed.data.requestId,
            content: parsed.data.content,
          });
        }
      } catch (err) {
        console.error("CAUGHT AN UNCAUGHT ERROR WHILE HANDLING MESSAGE", err);
      }
    }
  })();

  return server;
};
