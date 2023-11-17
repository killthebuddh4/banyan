import { MessageHandler } from "./MessageHandler.js";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";

export type Server = {
  client: Client;
  handlers: Map<string, MessageHandler>;
  stream: AsyncGenerator<DecodedMessage, void, unknown> | null;
  cache: DecodedMessage[];
};
