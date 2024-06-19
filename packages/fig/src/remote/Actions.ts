import { startClient } from "./actions/startClient.js";
import { stopClient } from "./actions/stopClient.js";
import { subscribeToClientStore } from "./actions/subscribeToClientStore.js";
import { fetchClient } from "./actions/fetchClient.js";
import { subscribeToGlobalMessageStreamStore } from "./actions/subscribeToGlobalMessageStreamStore.js";
import { startGlobalMessageStream } from "./actions/startGlobalMessageStream.js";
import { fetchGlobalMessageStream } from "./actions/fetchGlobalMessageStream.js";
import { listenToGlobalMessageStream } from "./actions/listenToGlobalMessageStream.js";
import { sendMessage } from "./actions/sendMessage.js";

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
