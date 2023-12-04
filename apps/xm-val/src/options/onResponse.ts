import { DecodedMessage } from "@xmtp/xmtp-js";

export const onResponse = ({ message }: { message: DecodedMessage }) => {
  console.log("onResponse", message.content);
};
