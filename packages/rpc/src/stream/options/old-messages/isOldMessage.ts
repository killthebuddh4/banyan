import { DecodedMessage } from "@xmtp/xmtp-js";
import { Options } from "../Options.js";
import { getStartTime } from "../../streams/getStartTime.js";
import { streamStore } from "../../streams/streamStore.js";

export const isOldMessage = ({
  options,
  message,
  clientAddress,
}: {
  options?: Options;
  message: DecodedMessage;
  clientAddress: string;
}) => {
  const startTime = getStartTime({
    store: streamStore,
    clientAddress,
  });

  if (startTime === null) {
    throw new Error(
      "This should never happen, a message from a stream that did't start?",
    );
  }

  return message.sent.getTime() <= startTime;
};
