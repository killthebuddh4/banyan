import { create } from "zustand";
import { Stream, Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import { AsyncState } from "../AsyncState";
import { clientStore } from "./clientStore";
import { v4 as uuidv4 } from "uuid";

type ConversationStream = {
  listen: (handler: (c: Conversation) => void) => () => void;
  stop: () => void;
};

const store = create<{
  stream: AsyncState<ConversationStream>;
  setStream: (stream: AsyncState<ConversationStream>) => void;
}>((set) => ({
  stream: { code: "idle" },
  setStream: (stream) => set({ stream }),
}));

clientStore.subscribe(() => {
  const stream = store.getState().stream;
  if (stream.code === "success") {
    stream.data.stop();
  }
  store.setState({ stream: { code: "idle" } });
});

const createConversationStream = (stream: Stream<Conversation>) => {
  const handlers: Array<{ id: string; handler: (c: Conversation) => void }> =
    [];

  const ignore = (id: string) => {
    const index = handlers.findIndex((h) => h.id === id);

    if (index === -1) {
      return;
    }

    handlers.splice(index, 1);
  };

  const listen = (handler: (c: Conversation) => void) => {
    const id = uuidv4();

    handlers.push({ id, handler });

    return () => ignore(id);
  };

  const stop = () => {
    stream.return();
  };

  return { listen, stop };
};

const startConversationStream = async () => {
  const inboxStream = store.getState().stream;

  if (inboxStream.code !== "idle") {
    return;
  }

  const client = clientStore.getState().client;

  if (client.code !== "success") {
    return;
  }

  store.setState({ stream: { code: "pending" } });

  try {
    const xmtpStream = await client.data.conversations.stream();
    const stream = createConversationStream(xmtpStream);
    store.setState({ stream: { code: "success", data: stream } });
    return;
  } catch {
    store.setState({
      stream: {
        code: "error",
        error: "client.data.conversations.stream() failed",
      },
    });
    return;
  }
};

const stopConversationStream = async () => {
  const inboxStream = store.getState().stream;

  if (inboxStream.code !== "success") {
    return;
  }

  inboxStream.data.stop();
  store.setState({ stream: { code: "idle" } });
};

const listenToConversationStream = (handler: (c: Conversation) => void) => {
  const inboxStream = store.getState().stream;

  if (inboxStream.code !== "success") {
    return null;
  }

  return inboxStream.data.listen(handler);
};

export const conversationStreamStore = {
  stream: () => store.getState().stream,
  start: startConversationStream,
  stop: stopConversationStream,
  listen: listenToConversationStream,
  subscribe: store.subscribe,
};
