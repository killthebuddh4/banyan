import { create } from "zustand";
import { DecodedMessage, Conversation, Stream } from "@xmtp/xmtp-js";
import { AsyncState } from "../AsyncState.js";
import { clientStore } from "./clientStore.js";
import { v4 as uuidv4 } from "uuid";
import { MessageStream } from "../MessageStream.js";
import { buildUniqueConversationKey } from "../buildUniqueConversationKey.js";

const store = create<{
  streams: Record<string, AsyncState<MessageStream>>;
  getStream: (key: string) => AsyncState<MessageStream>;
  setStream: (key: string, stream: AsyncState<MessageStream>) => void;
}>((set, get) => ({
  streams: {},
  getStream: (key) => {
    return get().streams[key] || { code: "idle" };
  },
  setStream: (key, stream) => {
    set((state) => {
      return {
        streams: {
          ...state.streams,
          [key]: stream,
        },
      };
    });
  },
}));

clientStore.subscribe(() => {
  const streams = store.getState().streams;

  for (const stream of Object.values(streams)) {
    if (stream.code === "success") {
      stream.data.stop();
    }
  }

  const reset = Object.keys(streams).reduce((acc, key) => {
    acc[key] = { code: "idle" };
    return acc;
  }, {} as Record<string, AsyncState<MessageStream>>);

  store.setState({ streams: reset });
});

const createMessageStream = (gen: Stream<DecodedMessage>) => {
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
    gen.return();
  };

  return { listen, stop };
};

const startMessageStream = async (conversation: Conversation) => {
  const client = clientStore.getState().client;

  if (client.code !== "success") {
    return;
  }

  const key = buildUniqueConversationKey(conversation);

  const messageStream = store.getState().getStream(key);

  if (messageStream.code !== "idle") {
    return;
  }

  store.getState().setStream(key, { code: "pending" });

  try {
    const xmtpConversation = await client.data.conversations.newConversation(
      conversation.peerAddress,
      conversation.context
    );
    const xmtpStream = await xmtpConversation.streamMessages();
    const stream = createMessageStream(xmtpStream);

    store.getState().setStream(key, { code: "success", data: stream });
    return;
  } catch {
    store.getState().setStream(key, {
      code: "error",
      error: "conversation.streamMessages() failed",
    });
    return;
  }
};

const stopMessageStream = async (conversation: Conversation) => {
  const key = buildUniqueConversationKey(conversation);
  const messageStream = store.getState().getStream(key);

  if (messageStream.code !== "success") {
    return;
  }

  messageStream.data.stop();

  store.getState().setStream(key, { code: "idle" });
};

const listenToMessageStream = (
  conversation: {
    peerAddress: string;
    context?: {
      conversationId?: string;
    };
  },
  handler: (m: DecodedMessage) => void
) => {
  const key = buildUniqueConversationKey(conversation);
  const messsageStream = store.getState().getStream(key);

  if (messsageStream.code !== "success") {
    return null;
  }

  return messsageStream.data.listen(handler);
};

export const conversationMessageStreamStore = {
  streams: () => store.getState().streams,
  stream: (id: string) => store.getState().getStream(id),
  start: startMessageStream,
  stop: stopMessageStream,
  listen: listenToMessageStream,
  subscribe: store.subscribe,
};
