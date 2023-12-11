import { DecodedMessage } from "@xmtp/xmtp-js";
import { withIdSchema } from "../withIdSchema.js";
import { jsonStringSchema } from "xm-lib/util/jsonStringSchema.js";

export const sendResponse = async ({
  toMessage,
  result,
  options,
}: {
  toMessage: DecodedMessage;
  result: unknown;
  options?: {
    onResponse?: ({
      toMessage,
      result,
    }: {
      toMessage: DecodedMessage;
      result: unknown;
    }) => void;
  };
}) => {
  const withId = jsonStringSchema.pipe(withIdSchema).parse(toMessage.content);

  const sent = await toMessage.conversation.send(
    JSON.stringify({
      jsonrpc: "2.0",
      id: withId.id,
      result,
    }),
  );

  if (options?.onResponse === undefined) {
    // do nothing
  } else {
    options.onResponse({ toMessage, result });
  }

  return sent;
};
