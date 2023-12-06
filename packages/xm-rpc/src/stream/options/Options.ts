import { DecodedMessage } from "@xmtp/xmtp-js";
import { Subscriber } from "../subscribers/Subscriber.js";

export type Options = {
  onAlreadyRunning?: () => void;
  onStream?: {
    before?: () => void;
    success?: () => void;
    error?: (err: unknown) => void;
  };
  onUncaughtHandlerError?: (err: unknown) => void;
  onSubscriberCalled?: ({ subscriber }: { subscriber: Subscriber }) => void;
  onMessageReceived?: ({ message }: { message: DecodedMessage }) => void;
  onMessageSent?: ({ message }: { message: DecodedMessage }) => void;
  onNotStarted?: () => void;
};
