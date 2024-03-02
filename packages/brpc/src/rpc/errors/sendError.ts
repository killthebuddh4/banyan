import { DecodedMessage } from "@xmtp/xmtp-js";
import { ErrorCode } from "./ErrorCode.js";
import { getDescription } from "./getDescription.js";

export const sendError = async ({
  toMessage,
  requestId,
  code,
  message,
}: {
  toMessage: DecodedMessage;
  requestId: string | null;
  code: ErrorCode;
  message: string;
}) => {
  return toMessage.conversation.send(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code,
        message,
        data: {
          description: getDescription({ code }),
        },
      },
      id: requestId,
    }),
  );
};
