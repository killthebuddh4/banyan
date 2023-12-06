import { onStreamBefore } from "../stream/options/onStreamBefore.js";
import { onStreamSuccess } from "../stream/options/onStreamSuccess.js";
import { onStreamError } from "../stream/options/onStreamError.js";
import { onUncaughtHandlerError } from "../stream/options/onUncaughtHandlerError.js";
import { onMessageReceived } from "../stream/options/onMessageReceived.js";
import { onSubscriberCalled } from "../stream/options/onSubscriberCalled.js";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { streamStore } from "../stream/streams/streamStore.js";
import { startStream } from "../stream/streams/startStream.js";
import { Options } from "../stream/options/Options.js";
import { Subscriber } from "../stream/subscribers/Subscriber.js";
import { subscriberStore } from "../stream/subscribers/subscriberStore.js";
import { setSubscriber } from "../stream/subscribers/setSubscriber.js";
import { getSubscribers } from "../stream/subscribers/getSubscribers.js";

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

  const subscribers = new Map<string, Subscriber>();

  const rootStream = (async function* () {
    for await (const message of stream) {
      if (message.senderAddress === client.address) {
        continue;
      }

      onMessageReceived({ options, message });

      try {
        const subscribers = getSubscribers({
          store: subscriberStore,
          clientAddress: message.senderAddress,
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

  const selectors = new Map<string, AsyncGenerator>();

  const stop = async () => {
    rootStream.return();
    for (const selector of selectors.values()) {
      selector.return(null);
    }
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
                subscribers.delete(uuid);
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
