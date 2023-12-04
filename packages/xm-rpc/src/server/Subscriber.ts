import { DecodedMessage } from "@xmtp/xmtp-js";

export type Subscriber = {
  metadata: {
    id: string;
  };
  handler: (message: DecodedMessage) => void;
};
