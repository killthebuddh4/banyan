import { DecodedMessage } from "@xmtp/xmtp-js";

export const onResponse = ({
  toMessage,
  result,
}: {
  toMessage: DecodedMessage;
  result: unknown;
}) => {
  console.log(
    "XM VAL SERVER :: SENT RESPONSE",
    toMessage.conversation.peerAddress,
  );
  console.log("XM VAL SERVER :: TO MESSAGE", toMessage.content);
  console.log("XM VAL SERVER :: RESULT", result);
};
