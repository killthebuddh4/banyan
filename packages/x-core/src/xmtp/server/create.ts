import { MessageHandler } from "./MessageHandler.js";
import { Server } from "./Server.js";
import { Client } from "@xmtp/xmtp-js";

export const createServer = ({
  fromClient,
}: {
  fromClient: Client;
}): Server => {
  return {
    client: fromClient,
    handlers: new Map<string, MessageHandler>(),
    stream: null,
    cache: [],
  };
};