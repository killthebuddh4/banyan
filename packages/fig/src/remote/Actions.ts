import { startClient } from "./actions/startClient.js";
import { stopClient } from "./actions/stopClient.js";
import { fetchState } from "./actions/fetchState.js";
import { subscribeToState } from "./actions/subscribeToState.js";
import { unsubscribeToState } from "./actions/unsubscribeToState.js";
import { startGlobalMessageStream } from "./actions/startGlobalMessageStream.js";
import { listenToGlobalMessageStream } from "./actions/listenToGlobalMessageStream.js";
import { sendMessage } from "./actions/sendMessage.js";

export type Actions = {
  startClient: typeof startClient;
  stopClient: typeof stopClient;
  startGlobalMessageStream: typeof startGlobalMessageStream;
  listenToGlobalMessageStream: typeof listenToGlobalMessageStream;
  sendMessage: typeof sendMessage;
  fetchState: typeof fetchState;
  subscribeToState: typeof subscribeToState;
  unsubscribeToState: typeof unsubscribeToState;
};
