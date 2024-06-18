import { startClient } from "./actions/startClient";
import { stopClient } from "./actions/stopClient";
import { subscribeToClientStore } from "./actions/subscribeToClientStore";
import { fetchClient } from "./actions/fetchClient";
import { subscribeToGlobalMessageStreamStore } from "./actions/subscribeToGlobalMessageStreamStore";
import { startGlobalMessageStream } from "./actions/startGlobalMessageStream";
import { fetchGlobalMessageStream } from "./actions/fetchGlobalMessageStream";
import { listenToGlobalMessageStream } from "./actions/listenToGlobalMessageStream";
import { sendMessage } from "./actions/sendMessage";

export type Actions = {
  startClient: typeof startClient;
  stopClient: typeof stopClient;
  subscribeToClientStore: typeof subscribeToClientStore;
  fetchClient: typeof fetchClient;
  subscribeToGlobalMessageStreamStore: typeof subscribeToGlobalMessageStreamStore;
  startGlobalMessageStream: typeof startGlobalMessageStream;
  fetchGlobalMessageStream: typeof fetchGlobalMessageStream;
  listenToGlobalMessageStream: typeof listenToGlobalMessageStream;
  sendMessage: typeof sendMessage;
};
