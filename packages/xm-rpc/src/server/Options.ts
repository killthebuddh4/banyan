import { DecodedMessage } from "@xmtp/xmtp-js";
import { Metadata } from "./Metadata.js";

export type Options = {
  onAlreadyRunning?: () => void;
  onStream?: {
    before?: () => void;
    success?: () => void;
    error?: (err: unknown) => void;
  };
  onUncaughtHandlerError?: (err: unknown) => void;
  onSubscriberCalled?: ({ metadata }: { metadata: Metadata }) => void;
  onMessageReceived?: ({ message }: { message: DecodedMessage }) => void;
  onNotStarted?: () => void;
};
