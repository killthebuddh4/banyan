import { DecodedMessage, Client } from "@xmtp/xmtp-js";

export type MessageHandler = ({
  client,
  message,
  requestId,
  content,
}: {
  client: Client;
  message: DecodedMessage;
  requestId: string;
  content: unknown;
}) => Promise<void>;
