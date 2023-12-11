import { DecodedMessage } from "@xmtp/xmtp-js";
import { jsonStringSchema } from "xm-lib/util/jsonStringSchema.js";
import { withIdSchema } from "./withIdSchema.js";

export const createRpcSelector = ({
  request,
  server,
  options,
}: {
  request: { id: string };
  server: { address: string };
  options?: {
    onSkippedMessage?: ({ message }: { message: DecodedMessage }) => void;
    onSelectedMessage?: ({ message }: { message: DecodedMessage }) => void;
  };
}) => {
  const onSkippedMessage =
    options?.onSkippedMessage ||
    (() => {
      // Do nothing
    });

  const onSelectedMessage =
    options?.onSelectedMessage ||
    (() => {
      // Do nothing
    });

  return async (message: DecodedMessage) => {
    if (message.senderAddress !== server.address) {
      onSkippedMessage({ message });
      return false;
    }

    const idFromResponse = jsonStringSchema
      .pipe(withIdSchema)
      .safeParse(message.content);

    if (!idFromResponse.success) {
      onSkippedMessage({ message });
      return false;
    }

    if (idFromResponse.data.id !== request.id) {
      onSkippedMessage({ message });
      return false;
    }

    onSelectedMessage({ message });
    return true;
  };
};
