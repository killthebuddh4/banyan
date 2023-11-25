import { DecodedMessage } from "@xmtp/xmtp-js";

export type Store = {
  handlers: Map<string, () => void>;
  stream: AsyncGenerator<DecodedMessage> | null;
};
