import { DecodedMessage } from "@xmtp/xmtp-js";
import { Subscriber } from "./Subscriber.js";

export type Xmtp = {
  publish: ({
    to,
    message,
  }: {
    to: string;
    message: string;
  }) => Promise<{ sent: DecodedMessage }>;
  subscribe: ({ subscription }: { subscription: Subscriber }) => void;
};
