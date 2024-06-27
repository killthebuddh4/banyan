import { Wallet } from "@ethersproject/wallet";
import { Client } from "@xmtp/xmtp-js";
import * as Brpc from "./brpc.js";
import { Message } from "./Message.js";

export const createPubSub = async <A extends Brpc.BrpcApi>({
  options,
}: {
  options?: {
    wallet?: Wallet;
    xmtpEnv?: "dev" | "production";
    conversationIdPrefix?: string;
    onSelfSentMessage?: ({ message }: { message: Message }) => void;
    onMissedMessage?: ({ message }: { message: Message }) => void;
    onHandlingMessage?: ({ message }: { message: Message }) => void;
    onCreateXmtpError?: () => void;
    onCreateStreamError?: () => void;
    onCreateStreamSuccess?: () => void;
    onHandlerError?: () => void;
    onPublishingMessage?: ({
      conversation,
    }: {
      conversation: {
        peerAddress: string;
        context?: { conversationId: string; metadata: {} };
      };
    }) => void;
    onPublishedMessage?: ({ published }: { published: Message }) => void;
    onPublishFailed?: () => void;
  };
}) => {
  const wallet = (() => {
    if (options?.wallet) {
      return options.wallet;
    }

    return Wallet.createRandom();
  })();

  const xmtpEnv = (() => {
    if (options?.xmtpEnv) {
      return options.xmtpEnv;
    }

    return "dev";
  })();

  let xmtp: Client | null = null;
  let stream: AsyncGenerator<Message, void, unknown> | null = null;
  let handler: ((message: Message) => void) | undefined;

  const start = async () => {
    if (handler === undefined) {
      throw new Error(
        "handler is not set, cannot start a server without a handler",
      );
    }

    xmtp = await (async () => {
      try {
        return await Client.create(wallet, { env: xmtpEnv });
      } catch (error) {
        if (options?.onCreateXmtpError) {
          try {
            options.onCreateXmtpError();
          } catch (error) {
            console.warn("onCreateXmtpError threw an error", error);
          }
        }

        throw error;
      }
    })();

    try {
      stream = await xmtp.conversations.streamAllMessages();
    } catch (error) {
      if (options?.onCreateStreamError) {
        try {
          options.onCreateStreamError();
        } catch (error) {
          console.warn("onCreateStreamError threw an error", error);
        }
      }
      throw error;
    }

    try {
      if (options?.onCreateStreamSuccess) {
        options.onCreateStreamSuccess();
      }
    } catch (error) {
      console.warn("onCreateStreamSuccess threw an error", error);
    }

    (async () => {
      for await (const message of stream) {
        if (message.senderAddress === xmtp.address) {
          if (options?.onSelfSentMessage) {
            try {
              options.onSelfSentMessage({ message });
            } catch (error) {
              console.warn("onSelfSentMessage threw an error", error);
            }
          }

          continue;
        }

        if (handler === undefined) {
          if (options?.onMissedMessage) {
            try {
              options.onMissedMessage({ message });
            } catch (error) {
              console.warn("onMissedMessage threw an error", error);
            }
          }

          continue;
        }

        try {
          if (options?.onHandlingMessage) {
            try {
              options.onHandlingMessage({ message });
            } catch (error) {
              console.warn("onHandlingMessage threw an error", error);
            }
          }

          handler(message);
        } catch (error) {
          if (options?.onHandlerError) {
            try {
              options.onHandlerError();
            } catch (error) {
              console.warn("onHandlerError threw an error", error);
            }
          }
        }
      }
    })();
  };

  const subscribe = (h: (message: Message) => void) => {
    if (handler !== undefined) {
      throw new Error("already subscribed, cannot subscribe twice");
    }

    handler = h;
  };

  const publish = async (args: {
    conversation: {
      peerAddress: string;
      context?: { conversationId: string; metadata: {} };
    };
    content: string;
  }) => {
    try {
      if (xmtp === null) {
        throw new Error("xmtp is not initialized");
      }

      const conversation = await xmtp.conversations.newConversation(
        args.conversation.peerAddress,
        args.conversation.context,
      );

      if (options?.onPublishingMessage) {
        try {
          options.onPublishingMessage({ conversation: args.conversation });
        } catch (error) {
          console.warn("onPublishingMessage threw an error", error);
        }
      }

      const published = await conversation.send(args.content);

      if (options?.onPublishedMessage) {
        try {
          options.onPublishedMessage({ published });
        } catch (error) {
          console.warn("onPublishedMessage threw an error", error);
        }
      }

      return published;
    } catch (error) {
      if (options?.onPublishFailed) {
        try {
          options.onPublishFailed();
        } catch (error) {
          console.warn("onPublishFailed threw an error", error);
        }
      }

      throw error;
    }
  };

  const stop = async () => {
    if (stream === null) {
      return;
    }

    await stream.return();
  };

  return { address: wallet.address, start, publish, subscribe, stop };
};
