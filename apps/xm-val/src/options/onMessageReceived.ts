import { DecodedMessage } from "@xmtp/xmtp-js";

export const onMessageReceived = ({ message }: { message: DecodedMessage }) => {
  console.log("XM-VAL-SERVER :: MESSAGE RECEIVED FROM ", message.senderAddress);
  console.log(
    "XM-VAL-SERVER :: MESSAGE SENT AT ",
    message.sent.toLocaleString(),
  );
  try {
    console.log(
      "XM-VAL-SERVER :: MESSAGE CONTENT ",
      JSON.parse(JSON.stringify(message.content, null, 2)),
    );
  } catch (err) {
    console.log("XM-VAL-SERVER :: MESSAGE CONTENT ", message.content);
  }
};
