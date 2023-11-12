import { Client } from "@xmtp/xmtp-js";
import { MessageHandler } from "./MessageHandler.js";
import { cacheMessage } from "./cacheMessage.js";
import { getMessages } from "./getMessages.js";

export const createServer = async ({
  fromClient,
  withHandlers,
}: {
  fromClient: Client;
  withHandlers: MessageHandler[];
}) => {
  const stream = await fromClient.conversations.streamAllMessages();

  (async () => {
    for await (const message of stream) {
      cacheMessage({ message });
      try {
        for (const handler of withHandlers) {
          handler({
            client: fromClient,
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

  return () => {
    stream.return(null);
  };
};
