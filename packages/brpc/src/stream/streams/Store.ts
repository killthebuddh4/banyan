import { DecodedMessage } from "@xmtp/xmtp-js";

export type Store = Map<
  string,
  {
    startedAt: number;
    stream: AsyncGenerator<DecodedMessage, void, unknown>;
  }
>;
