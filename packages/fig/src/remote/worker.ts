import "../polyfills.js";
import * as Comlink from "comlink";
import { startClient } from "./actions/startClient.js";
import { stopClient } from "./actions/stopClient.js";
import { subscribeToClientStore } from "./actions/subscribeToClientStore.js";
import { fetchState } from "./actions/fetchState.js";
import { subscribeToGlobalMessageStreamStore } from "./actions/subscribeToGlobalMessageStreamStore.js";
import { startGlobalMessageStream } from "./actions/startGlobalMessageStream.js";
import { fetchGlobalMessageStream } from "./actions/fetchGlobalMessageStream.js";
import { listenToGlobalMessageStream } from "./actions/listenToGlobalMessageStream.js";
import { sendMessage } from "./actions/sendMessage.js";

Comlink.expose({
  startClient,
  stopClient,
  subscribeToClientStore,
  fetchState,
  startGlobalMessageStream,
  subscribeToGlobalMessageStreamStore,
  fetchGlobalMessageStream,
  listenToGlobalMessageStream,
  sendMessage,
});
