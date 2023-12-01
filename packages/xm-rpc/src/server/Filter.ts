import { DecodedMessage } from "@xmtp/xmtp-js";
import { Metadata } from "./Metadata.js";
import { Server } from "./Server.js";

export type Filter = ({
  server,
  subscriber,
  message,
}: {
  server: Server;
  subscriber: Metadata;
  message: DecodedMessage;
}) => Promise<boolean>;
