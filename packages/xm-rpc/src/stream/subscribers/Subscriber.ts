import { DecodedMessage } from "@xmtp/xmtp-js";

export type Subscriber = {
  metadata: {
    id: string;
  };
  selector: (message: DecodedMessage) => Promise<boolean>;
  handler: (message: DecodedMessage) => void;
};
