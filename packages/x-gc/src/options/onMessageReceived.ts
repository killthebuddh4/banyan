import { DecodedMessage } from "@xmtp/xmtp-js";

export const onMessageReceived = ({ message }: { message: DecodedMessage }) => {
  console.log("Message received", message.content);
};
