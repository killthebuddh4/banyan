import { DecodedMessage, Client } from "@xmtp/xmtp-js";

export type MessageHandler = ({
  client,
  metadata,
  message,
}: {
  client: Client;
  metadata: {
    handler: { id: string };
  };
  message: DecodedMessage;
}) => Promise<DecodedMessage>;
