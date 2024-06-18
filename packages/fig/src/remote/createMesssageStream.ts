import { DecodedMessage } from "@xmtp/xmtp-js";
import { v4 as uuidv4 } from "uuid";

export const createMessageStream = (gen: AsyncGenerator<DecodedMessage>) => {
  const handlers: Array<{ id: string; handler: (m: DecodedMessage) => void }> =
    [];

  const ignore = (id: string) => {
    const index = handlers.findIndex((h) => h.id === id);

    if (index === -1) {
      return;
    }

    handlers.splice(index, 1);
  };

  const listen = (handler: (m: DecodedMessage) => void) => {
    const id = uuidv4();

    handlers.push({ id, handler });

    return () => ignore(id);
  };

  const stop = () => {
    gen.return(null);
  };

  (async () => {
    for await (const message of gen) {
      for (const { handler } of handlers) {
        handler(message);
      }
    }
  })();

  return { listen, stop };
};
