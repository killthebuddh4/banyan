import { Client } from "@xmtp/xmtp-js";

export type GroupServer = {
  client: Client;
  stop: () => void;
};
