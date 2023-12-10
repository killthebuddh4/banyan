import { DecodedMessage } from "@xmtp/xmtp-js";
import { Options } from "./Options.js";

let count = 0;
export const onSelfSentMessage = ({
  options,
  message,
}: {
  options?: Options;
  message: DecodedMessage;
}) => {
  if (options?.onSelfSentMessage === undefined) {
    // do nothing
  } else {
    options.onSelfSentMessage({ message });
  }
};
