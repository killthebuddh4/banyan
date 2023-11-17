import { z } from "zod";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { MessageHandler } from "../server/MessageHandler.js";
import { getLastMessage } from "../getLastMessage.js";
import { Server } from "../server/Server.js";
import { subscribe } from "../server/subscribe.js";
import { unsubscribe } from "../server/unsubscribe.js";

export const create = <Z extends z.ZodTypeAny>({
  usingLocalServer,
  forRemoteServerAddress,
  usingResponseSchema,
  options,
}: {
  usingLocalServer: Server;
  forRemoteServerAddress: string;
  usingResponseSchema: Z;
  options?: {
    onMessage?: () => void;
    onIgnore?: () => void;
    onAccept?: () => void;
  };
}) => {
  if (usingLocalServer.stream === null) {
    throw new Error(
      "The local server must be streaming in order to use it as a client",
    );
  }

  return () =>
    async ({ input }: { input: string }) => {
      let resolver: (message: DecodedMessage) => void;
      let unsub: () => void;

      const responsePromise = new Promise<z.infer<typeof usingResponseSchema>>(
        (resolve) => {
          resolver = resolve;
        },
      );

      const handler: MessageHandler = async ({ messages }) => {
        if (options?.onMessage !== undefined) {
          options.onMessage();
        }

        const message = getLastMessage({ fromMessages: messages });

        const response = usingResponseSchema.safeParse(message);

        if (!response.success) {
          if (options?.onIgnore !== undefined) {
            options.onIgnore();
          }

          return;
        } else {
          if (options?.onAccept !== undefined) {
            options.onAccept();
          }

          resolver(response.data);
          unsub();
        }
      };

      const handlerId = subscribe({
        toServer: usingLocalServer,
        usingHandler: handler,
      });

      unsub = () => unsubscribe({ fromServer: usingLocalServer, handlerId });

      const conversation =
        await usingLocalServer.client.conversations.newConversation(
          forRemoteServerAddress,
        );

      conversation.send(input);

      return responsePromise;
    };
};
