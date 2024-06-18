import { DecodedMessage } from "@xmtp/xmtp-js";

export type MessageStream = {
  listen: (handler: (m: DecodedMessage) => void) => () => void;
  stop: () => void;
};
