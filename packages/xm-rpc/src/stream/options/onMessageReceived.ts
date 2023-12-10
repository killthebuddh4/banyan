import { Options } from "./Options.js";
import { DecodedMessage } from "@xmtp/xmtp-js";

const msgs = new Map<string, string>();
let count = 0;
export const onMessageReceived = ({
  options,
  message,
}: {
  options?: Options;
  message: DecodedMessage;
}) => {
  console.log("MSG REC", message.senderAddress);
  console.log("MSG REC", message.conversation.peerAddress);
  console.log("MSG REC", message.conversation.context?.conversationId);
  console.log("MSG REC", message.sent);
  msgs.set(message.id, message.id);
  console.log("MSG REC", msgs.size);

  if (options?.onMessageReceived === undefined) {
    // do nothing
  } else {
    options.onMessageReceived({ message });
  }
};
