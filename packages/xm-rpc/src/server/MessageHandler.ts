import { DecodedMessage } from "@xmtp/xmtp-js";
import { Server } from "./Server.js";

export type MessageHandler = ({
  server,
  message,
}: {
  server: Server;
  message: DecodedMessage;
}) => Promise<void>;
