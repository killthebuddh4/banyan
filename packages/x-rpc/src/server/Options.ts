import { DecodedMessage } from "@xmtp/xmtp-js";

export type Options = {
  onAlreadyRunning?: () => void;
  onStream?: {
    before?: () => void;
    success?: () => void;
    error?: (err: unknown) => void;
  };
  onUncaughtHandlerError?: (err: unknown) => void;
  onHandlerCalled?: ({
    metadata,
  }: {
    metadata: { handler: { id: string } };
  }) => void;
  onMessageReceived?: ({ message }: { message: DecodedMessage }) => void;
  onNotStarted?: () => void;
};
