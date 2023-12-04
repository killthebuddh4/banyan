import { DecodedMessage } from "@xmtp/xmtp-js";

export const onMessageReceived = ({ message }: { message: DecodedMessage }) => {
  console.log("xm-gc :: Message received", message.content);
};
