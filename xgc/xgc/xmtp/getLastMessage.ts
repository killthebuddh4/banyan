import { DecodedMessage } from "@xmtp/xmtp-js";

export const getLastMessage = ({
  fromMessages,
}: {
  fromMessages: DecodedMessage[];
}) => {
  if (fromMessages.length === 0) {
    throw new Error("No messages");
  }

  console.log("GETTING LAST MESSAGE FROM LENGTH ", fromMessages.length);

  return fromMessages[fromMessages.length - 1];
};
