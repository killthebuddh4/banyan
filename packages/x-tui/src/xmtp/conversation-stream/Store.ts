import { Stream, Conversation } from "@xmtp/xmtp-js";

export type Store = {
  handlers: Map<string, () => void>;
  stream: Stream<Conversation> | null;
};
