import { DecodedMessage } from "@xmtp/xmtp-js";

export const convertXmtpMessageToOpenAiMessage = ({
  copilotAddress,
  xmtpMessages,
}: {
  copilotAddress: string;
  xmtpMessages: DecodedMessage[];
}): Array<{ role: "user" | "assistant"; content: string }> => {
  return xmtpMessages.map((xmtpMessage) => {
    const role = (() => {
      if (xmtpMessage.senderAddress === copilotAddress) {
        return "assistant";
      } else {
        return "user";
      }
    })();

    return {
      role,
      content: xmtpMessage.content,
    };
  });
};
