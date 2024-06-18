import "../polyfills";
import * as Comlink from "comlink";
import { startClient } from "./actions/startClient";
import { stopClient } from "./actions/stopClient";
import { subscribeToClientStore } from "./actions/subscribeToClientStore";
import { fetchClient } from "./actions/fetchClient";
import { subscribeToGlobalMessageStreamStore } from "./actions/subscribeToGlobalMessageStreamStore";
import { startGlobalMessageStream } from "./actions/startGlobalMessageStream";
import { fetchGlobalMessageStream } from "./actions/fetchGlobalMessageStream";
import { listenToGlobalMessageStream } from "./actions/listenToGlobalMessageStream";
import { sendMessage } from "./actions/sendMessage";

Comlink.expose({
  startClient,
  stopClient,
  subscribeToClientStore,
  fetchClient,
  startGlobalMessageStream,
  subscribeToGlobalMessageStreamStore,
  fetchGlobalMessageStream,
  listenToGlobalMessageStream,
  sendMessage,
});
