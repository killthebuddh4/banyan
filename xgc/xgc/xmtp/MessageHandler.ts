import { DecodedMessage, Client } from "@xmtp/xmtp-js";

export type MessageHandler = ({
  client,
  messages,
}: {
  client: Client;
  messages: DecodedMessage[];
}) => Promise<void>;
