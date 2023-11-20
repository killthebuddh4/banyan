import { z } from "zod";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { MessageHandler } from "../server/MessageHandler.js";
import { Server } from "../server/Server.js";
import { subscribe } from "../server/subscribe.js";
import { unsubscribe } from "../server/unsubscribe.js";
import { v4 as uuid } from "uuid";
import { createRequest } from "./createRequest.js";
import { callSchema } from "../../actions/callSchema.js";

export const createClient = ({
  usingLocalServer,
  forRemoteServerAddress,
  options,
}: {
  usingLocalServer: Server;
  forRemoteServerAddress: string;
  options?: {
    onMessage?: ({ message }: { message: DecodedMessage }) => void;
    onIgnore?: ({ message }: { message: DecodedMessage }) => void;
    onAccept?: ({ message }: { message: DecodedMessage }) => void;
  };
}) => {
  if (usingLocalServer.stream === null) {
    throw new Error(
      "The local server must be streaming in order to use it as a client",
    );
  }

  return async (input: z.infer<typeof callSchema>) => {
    const rid = uuid();
    let resolver: ({
      requestId,
      content,
      message,
    }: {
      content: unknown;
      requestId: string;
      message: DecodedMessage;
    }) => void;

    const responsePromise = new Promise<{
      requestId: string;
      message: DecodedMessage;
      content: unknown;
    }>((resolve) => {
      resolver = resolve;
    });

    const handler: MessageHandler = async ({ requestId, message, content }) => {
      if (options?.onMessage !== undefined) {
        options.onMessage({ message });
      }

      if (rid !== requestId) {
        if (options?.onIgnore !== undefined) {
          options.onIgnore({ message });
        }
        return;
      } else {
        if (options?.onAccept !== undefined) {
          options.onAccept({ message });
        }

        resolver({
          message,
          content,
          requestId,
        });

        unsubscribe({ fromServer: usingLocalServer, handlerId: rid });
      }
    };

    subscribe({
      handlerId: rid,
      toServer: usingLocalServer,
      usingHandler: handler,
    });

    const conversation =
      await usingLocalServer.client.conversations.newConversation(
        forRemoteServerAddress,
      );

    await conversation.send(
      createRequest({ usingRequestId: rid, fromInput: input }),
    );

    return responsePromise;
  };
};
