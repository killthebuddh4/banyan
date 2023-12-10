import { DecodedMessage } from "@xmtp/xmtp-js";
import { withIdSchema } from "../withIdSchema.js";
import { jsonStringSchema } from "xm-lib/util/jsonStringSchema.js";

export const sendResponse = async ({
  toMessage,
  result,
}: {
  toMessage: DecodedMessage;
  result: unknown;
}) => {
  const withId = jsonStringSchema.pipe(withIdSchema).parse(toMessage.content);

  return toMessage.conversation.send(
    JSON.stringify({
      jsonrpc: "2.0",
      id: withId.id,
      result,
    }),
  );
};
