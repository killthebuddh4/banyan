import { onStreamBefore } from "../stream/options/onStreamBefore.js";
import { onStreamSuccess } from "../stream/options/onStreamSuccess.js";
import { onStreamError } from "../stream/options/onStreamError.js";
import { onUncaughtHandlerError } from "../stream/options/onUncaughtHandlerError.js";
import { onMessageReceived } from "../stream/options/onMessageReceived.js";
import { onSubscriberCalled } from "../stream/options/onSubscriberCalled.js";
import { onSelfSentMessage } from "../stream/options/onSelfSentMessage.js";
import { isOldMessage } from "../stream/options/old-messages/isOldMessage.js";
import { allowOldMessages } from "../stream/options/old-messages/allowOldMessages.js";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { streamStore } from "../stream/streams/streamStore.js";
import { startStream } from "../stream/streams/startStream.js";
import { Options } from "../stream/options/Options.js";
import { subscriberStore } from "../stream/subscribers/subscriberStore.js";
import { setSubscriber } from "../stream/subscribers/setSubscriber.js";
import { getSubscribers } from "../stream/subscribers/getSubscribers.js";
import { deleteSubscriber } from "../stream/subscribers/deleteSubscriber.js";
import crypto from "crypto";

export const createStream = async ({
  client,
  options,
}: {
  client: Client;
  options?: Options;
}) => {
  onStreamBefore({ options });

  let stream: AsyncGenerator<DecodedMessage, void, unknown>;
  try {
    stream = await startStream({ store: streamStore, client });
  } catch (err) {
    onStreamError({ options, err });
    throw new Error("Failed to start server");
  }

  onStreamSuccess({ options });

  (async () => {
    for await (const message of stream) {
      if (message.senderAddress === client.address) {
        onSelfSentMessage({ options, message });
        continue;
      }

      if (!allowOldMessages({ options })) {
        if (isOldMessage({ options, message, clientAddress: client.address })) {
          continue;
        }
      }

      onMessageReceived({ options, message });

      try {
        const subscribers = getSubscribers({
          store: subscriberStore,
          clientAddress: client.address,
        });

        for (const subscriber of subscribers.values()) {
          if (!(await subscriber.selector(message))) {
            // TODO
            continue;
          } else {
            onSubscriberCalled({ options, subscriber });

            subscriber.handler(message);
          }
        }
      } catch (err) {
        onUncaughtHandlerError({ options, err });
      }
    }
  })();

  const stop = async () => {
    stream.return();
  };

  const select = ({ selector }: { selector: Selector }) => {
    const derivedStream = (async function* () {
      const createPromise = () => {
        return new Promise<DecodedMessage>((resolve) => {
          const uuid = crypto.randomUUID();
          setSubscriber({
            store: subscriberStore,
            clientAddress: client.address,
            subscriber: {
              metadata: { id: uuid },
              selector,
              handler: (message) => {
                deleteSubscriber({
                  store: subscriberStore,
                  clientAddress: client.address,
                  subscriberId: uuid,
                });
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
    })();

    return derivedStream;
  };

  return {
    stop,
    select,
  };
};

type Selector = (message: DecodedMessage) => Promise<boolean>;
