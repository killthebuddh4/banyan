import { DecodedMessage } from "@xmtp/xmtp-js";

export type Store = Map<string, AsyncGenerator<DecodedMessage, void, unknown>>;
