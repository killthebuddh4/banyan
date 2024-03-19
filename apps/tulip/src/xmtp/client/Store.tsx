import { Client } from "@xmtp/xmtp-js";

export type Store = {
  client: Client | undefined;
  handlers: Map<string, () => void>;
};
