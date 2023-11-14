import { DecodedMessage } from "@xmtp/xmtp-js";
import { signatureSchema } from "../actions/signatureSchema.js";

/* *****************************************************************************
 *
 * We assume that a command message looks like this:
 *
 * /name
 * {
 *   ...arguments
 * }
 *
 * ****************************************************************************/

export const getCommandFromMessage = ({
  message,
}: {
  message: DecodedMessage;
}) => {
  if (typeof message.content !== "string") {
    throw new Error("Message content must be a string.");
  }

  const lines = message.content.split("\n");

  if (lines.length === 0) {
    throw new Error("Message content must have at least one line.");
  }

  if (!lines[0].startsWith("/")) {
    throw new Error("Message command line must start with a slash.");
  }

  const name = lines[0].slice(1);
  const argsLines = lines.slice(1);
  const args = argsLines.join("\n");

  return signatureSchema.parse({
    name,
    arguments: args,
  });
};
