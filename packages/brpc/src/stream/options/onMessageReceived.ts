import { Options } from "./Options.js";
import { DecodedMessage } from "@xmtp/xmtp-js";

export const onMessageReceived = ({
  options,
  message,
}: {
  options?: Options;
  message: DecodedMessage;
}) => {
  if (options?.onMessageReceived === undefined) {
    // do nothing
  } else {
    options.onMessageReceived({ message });
  }
};
