import { DecodedMessage } from "@xmtp/xmtp-js";
import { Server } from "../Server.js";
import crypto from "crypto";
import { setSubscriber } from "../setSubscriber.js";

/* TODO, I think there's a bunch of race conditions in this code that need to be
 * properly handled. */
export const subscribe = ({
  toServer,
  options,
}: {
  toServer: Server;
  options?: {};
}) => {
  const gen = async function* () {
    const createPromise = () => {
      return new Promise<DecodedMessage>((resolve) => {
        const uuid = crypto.randomUUID();
        setSubscriber({
          server: toServer,
          subscriber: {
            metadata: {
              id: uuid,
            },
            handler: (message) => {
              toServer.subscribers.delete(uuid);
              resolve(message);
            },
          },
        });
      });
    };

    const messages = [createPromise()];

    while (messages.length > 0) {
      const message = await messages.pop();
      if (message === undefined) {
        throw new Error(
          "This should never happen, messages.length > 0, right?",
        );
      }
      yield message;
      messages.push(createPromise());
    }
  };

  return gen();
};
