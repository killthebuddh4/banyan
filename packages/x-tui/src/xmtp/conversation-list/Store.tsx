import { Conversation } from "@xmtp/xmtp-js";

export type Store = {
  handlers: Map<string, () => void>;
  index: Map<string, Conversation>;
  conversations: Conversation[];
};
