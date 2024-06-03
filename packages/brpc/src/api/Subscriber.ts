import { DecodedMessage } from "@xmtp/xmtp-js";

export type Subscriber = ({
  unsubscribe,
  message,
}: {
  unsubscribe: () => void;
  message: DecodedMessage;
}) => void;
