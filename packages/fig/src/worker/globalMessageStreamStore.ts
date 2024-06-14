import { create } from "zustand";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { AsyncState } from "./AsyncState";
import { clientStore } from "./clientStore";
import { v4 as uuidv4 } from "uuid";
import { MessageStream } from "./MessageStream";

const store = create<{
  stream: AsyncState<MessageStream>;
  setStream: (stream: AsyncState<MessageStream>) => void;
}>((set) => ({
  stream: { id: "idle" },
  setStream: (stream) => set({ stream }),
}));

clientStore.subscribe(() => {
  const stream = store.getState().stream;
  if (stream.id === "success") {
    stream.data.stop();
  }
  store.setState({ stream: { id: "idle" } });
});

const createMessageStream = (gen: AsyncGenerator<DecodedMessage>) => {
  const handlers: Array<{ id: string; handler: (m: DecodedMessage) => void }> =
    [];

  const ignore = (id: string) => {
    const index = handlers.findIndex((h) => h.id === id);

    if (index === -1) {
      return;
    }

    handlers.splice(index, 1);
  };

  const listen = (handler: (m: DecodedMessage) => void) => {
    const id = uuidv4();

    handlers.push({ id, handler });

    return () => ignore(id);
  };

  const stop = () => {
    gen.return(null);
  };

  return { listen, stop };
};

const startMessageStream = async () => {
  const messageStream = store.getState().stream;

  if (messageStream.id !== "idle") {
    return;
  }

  const client = clientStore.client();

  if (client.id !== "success") {
    return;
  }

  store.setState({ stream: { id: "pending" } });

  try {
    const gen = await client.data.conversations.streamAllMessages();
    const stream = createMessageStream(gen);
    store.setState({ stream: { id: "success", data: stream } });
    return;
  } catch {
    store.setState({
      stream: {
        id: "error",
        error: "client.data.conversations.streamAllMessages failed",
      },
    });
    return;
  }
};

const stopMessageStream = async () => {
  const messageStream = store.getState().stream;

  if (messageStream.id !== "success") {
    return;
  }

  messageStream.data.stop();
  store.setState({ stream: { id: "idle" } });
};

const listenToMessageStream = (handler: (m: DecodedMessage) => void) => {
  const messageStream = store.getState().stream;

  if (messageStream.id !== "success") {
    return null;
  }

  return messageStream.data.listen(handler);
};

export const globalMessageStreamStore = {
  stream: () => store.getState().stream,
  start: startMessageStream,
  stop: stopMessageStream,
  listen: listenToMessageStream,
  subscribe: store.subscribe,
};
