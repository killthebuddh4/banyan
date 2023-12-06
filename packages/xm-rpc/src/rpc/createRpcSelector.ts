import { DecodedMessage } from "@xmtp/xmtp-js";
import { jsonStringSchema } from "xm-lib/jsonStringSchema.js";
import { withIdSchema } from "./withIdSchema.js";

export const createRpcSelector = ({
  request,
  server,
}: {
  request: { id: string };
  server: { address: string };
}) => {
  return async (message: DecodedMessage) => {
    if (message.senderAddress !== server.address) {
      return false;
    }

    const idFromResponse = jsonStringSchema
      .pipe(withIdSchema)
      .safeParse(message.content);

    if (!idFromResponse.success) {
      return false;
    }

    if (idFromResponse.data.id !== request.id) {
      return false;
    }

    return true;
  };
};
