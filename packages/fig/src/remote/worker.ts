import "../polyfills.js";
import * as Comlink from "comlink";
import { startClient } from "./actions/startClient.js";
import { stopClient } from "./actions/stopClient.js";
import { fetchState } from "./actions/fetchState.js";
import { startGlobalMessageStream } from "./actions/startGlobalMessageStream.js";
import { listenToGlobalMessageStream } from "./actions/listenToGlobalMessageStream.js";
import { sendMessage } from "./actions/sendMessage.js";
import { subscribeToState } from "./actions/subscribeToState.js";
import { ignoreGlobalMessageStream } from "./actions/ignoreGlobalMessageStream.js";
import { stopGlobalMessageStream } from "./actions/stopGlobalMessageStream.js";

Comlink.expose({
  startClient,
  stopClient,
  fetchState,
  subscribeToState,
  startGlobalMessageStream,
  stopGlobalMessageStream,
  listenToGlobalMessageStream,
  ignoreGlobalMessageStream,
  sendMessage,
});
