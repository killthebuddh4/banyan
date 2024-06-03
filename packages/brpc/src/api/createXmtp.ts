import { Client } from "@xmtp/xmtp-js";
import { Subscriber } from "./Subscriber.js";
import { v4 as uuidv4 } from "uuid";

export const createXmtp = async ({
  client,
  options,
}: {
  client: Client;
  options?: {
    onCreateStreamError?: () => void;
    onCreateStreamSuccess?: () => void;
    onHandlerError?: () => void;
    onPublishError?: () => void;
  };
}) => {
  const stream = await (async () => {
    try {
      return await client.conversations.streamAllMessages();
    } catch (error) {
      if (options?.onCreateStreamError) {
        options.onCreateStreamError();
      }
      throw error;
    }
  })();

  try {
    if (options?.onCreateStreamSuccess) {
      options.onCreateStreamSuccess();
    }
  } catch (error) {
    console.warn("onCreateStreamSuccess threw an error", error);
  }

  const subscriptions: Array<{ id: string; subscriber: Subscriber }> = [];

  const unsubscribe = ({ id }: { id: string }) => {
    const idx = subscriptions.findIndex((sub) => sub.id === id);

    if (idx === -1) {
      return;
    }

    subscriptions.splice(idx, 1);
  };

  const subscribe = ({ subscriber }: { subscriber: Subscriber }) => {
    const id = uuidv4();

    subscriptions.push({ id, subscriber });

    return {
      unsubscribe: () => {
        unsubscribe({ id });
      },
    };
  };

  (async () => {
    for await (const message of stream) {
      for (const subscription of subscriptions) {
        try {
          subscription.subscriber({
            message,
            unsubscribe: () => {
              unsubscribe({ id: subscription.id });
            },
          });
        } catch (err) {
          if (options?.onHandlerError) {
            try {
              options.onHandlerError();
            } catch (error) {
              console.warn("onHandlerError threw an error", error);
            }
          }

          unsubscribe({ id: subscription.id });
        }
      }
    }
  })();

  const publish = async ({ to, message }: { to: string; message: string }) => {
    const conversation = await client.conversations.newConversation(to);

    const sent = await (async () => {
      try {
        return await conversation.send(message);
      } catch (error) {
        if (options?.onPublishError) {
          options.onPublishError();
        }
        throw error;
      }
    })();

    return { sent };
  };

  return {
    publish,
    subscribe,
  };
};
