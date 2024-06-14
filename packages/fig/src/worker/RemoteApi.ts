import { Signer } from "./Signer";
import { AsyncHandler } from "./AsyncHandler";
import { AsyncState } from "./AsyncState";
import { StartClientOpts } from "./StartClientOpts";
import { Message } from "./Message";

export type RemoteApi = {
  subscribeToClientStore: (args: { onChange: AsyncHandler<undefined> }) => void;
  getClient: () => AsyncState<undefined>;
  startClient: (wallet: Signer, opts?: StartClientOpts) => void;
  stopClient: () => void;
  subscribeToGlobalMessageStreamStore: (args: {
    onChange: AsyncHandler<undefined>;
  }) => void;
  getGlobalMessageStream: () => AsyncState<undefined>;
  startGlobalMessageStream: () => Promise<void>;
  listenToGlobalMessagesStream: (handler: (message: Message) => void) => void;
};
