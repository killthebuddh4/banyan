import "./polyfills";
import * as Comlink from "comlink";
import * as Lib from "./lib";
import * as Sdk from "@xmtp/xmtp-js";
import { create } from "zustand";

/* **************************************************************************
 *
 * CLIENT
 *
 * *************************************************************************/

type ClientStore = {
  client: Lib.AsyncState<Sdk.Client>;
  setClient: (client: Lib.AsyncState<Sdk.Client>) => void;
};

const clientStore = create<ClientStore>((set) => ({
  client: { id: "idle" },
  setClient: (client) => set({ client }),
}));

const subscribeToClientStore: Lib.Actions["subscribeToClientStore"] = ({
  onChange,
}) => {
  clientStore.subscribe((state) => {
    switch (state.client.id) {
      case "idle":
      case "pending":
        onChange({ id: state.client.id });
        break;
      case "success":
        onChange({ id: "success", data: undefined });
        break;
      case "error":
        onChange({ id: "error", error: state.client.error });
        break;
      default:
        throw new Error("Unreachable");
    }
  });
};

const getClient = () => {
  const client = clientStore.getState().client;

  switch (client.id) {
    case "idle":
    case "pending":
      return { id: client.id };
    case "success":
      return { id: "success", data: undefined };
    case "error":
      return { id: "error", error: client.error };
    default:
      throw new Error("Unreachable");
  }
};

const startClient: Lib.Actions["startClient"] = async (wallet, opts) => {
  const client = clientStore.getState().client;

  if (client.id !== "idle") {
    return { status: 400 };
  }

  try {
    clientStore.setState({ client: { id: "pending" } });

    const xmtpKey = opts?.privateKeyOverride;
    const env = opts?.env ?? "production";
    const privateKeyOverride = await (async () => {
      if (wallet === null) {
        if (xmtpKey === undefined) {
          throw new Error(Lib.ErrorCodes.BAD_ARGUMENTS);
        } else {
          return Sdk.Client.getKeys(wallet, {
            env,
            privateKeyOverride: Buffer.from(xmtpKey, "base64"),
          });
        }
      } else {
        return Sdk.Client.getKeys(wallet, { env });
      }
    })();

    const client = await Sdk.Client.create(null, {
      env,
      privateKeyOverride,
    });

    clientStore.setState({ client: { id: "success", data: client } });
    return { status: 200, data: undefined };
  } catch (error) {
    clientStore.setState({ client: { id: "error", error } });
    return { status: 500 };
  }
};

const stopClient = async () => {
  const client = clientStore.getState().client;

  if (client.id !== "success") {
    return { status: 400 };
  }

  try {
    clientStore.setState({ client: { id: "idle" } });
    return { status: 200 };
  } catch (error) {
    clientStore.setState({ client: { id: "error", error } });
    return { status: 500 };
  }
};

/* **************************************************************************
 *
 * MESSAGES STREAM
 *
 * *************************************************************************/

type MessagesStreamStore = {
  stream: Lib.AsyncState<MessageStream>;
  setStream: (stream: Lib.AsyncState<MessageStream>) => void;
};

const messagesStreamStore = create<MessagesStreamStore>((set) => ({
  stream: { id: "idle" },
  setStream: (stream) => set({ stream }),
}));

clientStore.subscribe((state) => {
  if (state.client.id !== "success") {
    messagesStreamStore.setState({ stream: { id: "idle" } });
    const stream = messagesStreamStore.getState().stream;
    if (stream.id === "success") {
      stream.data.stop();
    }
  } else {
    messagesStreamStore.setState({
      stream: { id: "idle" },
    });
  }
});

const subscribeToMessagesStreamStore: Lib.Actions["subscribeToMessagesStreamStore"] =
  ({ onChange }) => {
    messagesStreamStore.subscribe((state) => {
      switch (state.stream.id) {
        case "idle":
        case "pending":
          onChange({ id: state.stream.id });
          break;
        case "success":
          onChange({ id: "success", data: undefined });
          break;
        case "error":
          onChange({ id: "error", error: state.stream.error });
          break;
        default:
          throw new Error("Unreachable");
      }
    });
  };

const getMessagesStream = () => {
  const stream = messagesStreamStore.getState().stream;

  switch (stream.id) {
    case "idle":
    case "pending":
      return { id: stream.id };
    case "success":
      return { id: "success", data: undefined };
    case "error":
      return { id: "error", error: stream.error };
    default:
      throw new Error("Unreachable");
  }
};

const startMessagesStream: Lib.Actions["startMessagesStream"] = async () => {
  const stream = messagesStreamStore.getState().stream;
  const client = clientStore.getState().client;

  if (client.id !== "success") {
    return { status: 400, error: "Client not found but stream is idle" };
  }

  if (stream.id !== "idle") {
    return { status: 400, error: "Stream not idle" };
  }

  try {
    messagesStreamStore.setState({ stream: { id: "pending" } });

    const stream = await client.data.conversations.streamAllMessages();

    messagesStreamStore.setState({
      stream: { id: "success", data: new MessageStream(stream) },
    });

    return { status: 200, data: undefined };
  } catch {
    messagesStreamStore.setState({
      stream: {
        id: "error",
        error: "client.data.conversations.streamAllMessages() threw",
      },
    });
    return { status: 500 };
  }
};

const stopMessagesStream: Lib.Actions["stopMessagesStream"] = async () => {
  const stream = messagesStreamStore.getState().stream;

  if (stream.id !== "success") {
    return { status: 400, error: "Stream not success" };
  }

  try {
    messagesStreamStore.setState({ stream: { id: "idle" } });
    return { status: 200, data: undefined };
  } catch {
    messagesStreamStore.setState({
      stream: { id: "error", error: "unknown error" },
    });
    return { status: 500 };
  }
};

const listenToMessagesStream: Lib.Actions["listenToMessagesStream"] = async (
  handler
) => {
  const stream = messagesStreamStore.getState().stream;

  if (stream.id !== "success") {
    return { status: 400 };
  }

  try {
    stream.data.addHandler(handler);
    return { status: 200 };
  } catch (error) {
    messagesStreamStore.setState({ stream: { id: "error", error } });
    return { status: 500 };
  }
};

/* **************************************************************************
 *
 * CONVERSATIONS STREAM
 *
 * *************************************************************************/

type ConversationsStreamStore = {
  stream: Lib.AsyncState<ConversationStream>;
  setStream: (stream: Lib.AsyncState<ConversationStream>) => void;
};

const conversationsStreamStore = create<ConversationsStreamStore>((set) => ({
  stream: { id: "idle" },
  setStream: (stream) => set({ stream }),
}));

clientStore.subscribe((state) => {
  if (state.client.id !== "success") {
    conversationsStreamStore.setState({ stream: { id: "idle" } });
    const stream = conversationsStreamStore.getState().stream;
    if (stream.id === "success") {
      stream.data.stop();
    }
  } else {
    conversationsStreamStore.setState({
      stream: { id: "idle" },
    });
  }
});

const subscribeToConversationsStreamStore: Lib.Actions["subscribeToConversationsStreamStore"] =
  ({ onChange }) => {
    conversationsStreamStore.subscribe((state) => {
      switch (state.stream.id) {
        case "idle":
        case "pending":
          onChange({ id: state.stream.id });
          break;
        case "success":
          onChange({ id: "success", data: undefined });
          break;
        case "error":
          onChange({ id: "error", error: state.stream.error });
          break;
        default:
          throw new Error("Unreachable");
      }
    });
  };

const getConversationsStream = () => {
  const stream = conversationsStreamStore.getState().stream;

  switch (stream.id) {
    case "idle":
    case "pending":
      return { id: stream.id };
    case "success":
      return { id: "success", data: undefined };
    case "error":
      return { id: "error", error: stream.error };
    default:
      throw new Error("Unreachable");
  }
};

const startConversationsStream: Lib.Actions["startConversationsStream"] =
  async () => {
    const stream = conversationsStreamStore.getState().stream;
    const client = clientStore.getState().client;

    if (stream.id !== "idle") {
      return { status: 400 };
    }

    if (client.id !== "success") {
      throw new Error("Client not found but stream is idle");
    }

    try {
      conversationsStreamStore.setState({ stream: { id: "pending" } });

      const stream = await client.data.conversations.stream();

      conversationsStreamStore.setState({
        stream: { id: "success", data: new ConversationStream(stream) },
      });
      return { status: 200, data: undefined };
    } catch (error) {
      conversationsStreamStore.setState({ stream: { id: "error", error } });
      return { status: 500 };
    }
  };

const stopConversationsStream: Lib.Actions["stopConversationsStream"] =
  async () => {
    const stream = conversationsStreamStore.getState().stream;

    if (stream.id !== "success") {
      return { status: 400 };
    }

    try {
      conversationsStreamStore.setState({ stream: { id: "idle" } });
      return { status: 200, data: undefined };
    } catch (error) {
      conversationsStreamStore.setState({ stream: { id: "error", error } });
      return { status: 500 };
    }
  };

const listenToConversationsStream: Lib.Actions["listenToConversationsStream"] =
  async (handler) => {
    const stream = conversationsStreamStore.getState().stream;

    if (stream.id !== "success") {
      return { status: 400 };
    }

    try {
      stream.data.addHandler(handler);
      return { status: 200, data: undefined };
    } catch (error) {
      conversationsStreamStore.setState({ stream: { id: "error", error } });
      return { status: 500 };
    }
  };

/* **************************************************************************
 *
 * CONVERSATION STREAMS
 *
 * *************************************************************************/

type ConversationStreamsStore = {
  streams: Record<string, Lib.AsyncState<MessageStream>>;
  setStreams: (streams: Record<string, Lib.AsyncState<MessageStream>>) => void;
};

const conversationStreamsStore = create<ConversationStreamsStore>((set) => ({
  streams: {},
  setStreams: (streams) => set({ streams }),
}));

clientStore.subscribe((state) => {
  if (state.client.id !== "success") {
    const streams = conversationStreamsStore.getState().streams;
    for (const stream of Object.values(streams)) {
      if (stream.id === "success") {
        stream.data.stop();
      }
    }
    conversationStreamsStore.setState({ streams: {} });
  }
});

const setConversationStream = (
  conversation: Lib.Conversation,
  state: Lib.AsyncState<MessageStream>
) => {
  const key = Lib.uniqueConversationKey(conversation);

  conversationStreamsStore.setState((prev) => {
    return {
      ...prev,
      streams: {
        ...prev.streams,
        [key]: state,
      },
    };
  });
};

const subscribeToConversationStreamsStore: Lib.Actions["subscribeToConversationStreamsStore"] =
  (conversation, onChange) => {
    const key = Lib.uniqueConversationKey(conversation);

    conversationStreamsStore.subscribe((state) => {
      const client = clientStore.getState().client;

      if (client.id !== "success") {
        onChange({ id: "idle" });
        return;
      }

      const stream = state.streams[key];

      if (stream === undefined) {
        onChange({ id: "idle" });
        return;
      }

      switch (stream.id) {
        case "idle":
        case "pending":
          onChange({ id: stream.id });
          break;
        case "success":
          onChange({ id: "success", data: undefined });
          break;
        case "error":
          onChange({ id: "error", error: stream.error });
          break;
        default:
          throw new Error("Unreachable");
      }
    });
  };

const getConversationStream = (conversation: Lib.Conversation) => {
  const key = Lib.uniqueConversationKey(conversation);
  const stream = conversationStreamsStore.getState().streams[key];

  if (stream === undefined) {
    return { id: "idle" };
  }

  switch (stream.id) {
    case "idle":
    case "pending":
      return { id: stream.id };
    case "success":
      return { id: "success", data: undefined };
    case "error":
      return { id: "error", error: stream.error };
    default:
      throw new Error("Unreachable");
  }
};

const startConversationStream: Lib.Actions["startConversationStream"] = async ({
  conversation,
}) => {
  const key = Lib.uniqueConversationKey(conversation);
  const stream = conversationStreamsStore.getState().streams[key];
  const client = clientStore.getState().client;

  console.log("startConversationStream", conversation, stream, client);

  if (client.id !== "success") {
    return { status: 400 };
  }

  if (stream !== undefined && stream.id !== "idle") {
    return { status: 400 };
  }

  try {
    setConversationStream(conversation, { id: "pending" });

    const convo = await client.data.conversations.newConversation(
      conversation.peerAddress,
      conversation.context
    );

    const stream = await convo.streamMessages();

    setConversationStream(conversation, {
      id: "success",
      data: new MessageStream(stream),
    });

    return { status: 200, data: undefined };
  } catch (error) {
    setConversationStream(conversation, { id: "error", error });
    return { status: 500 };
  }
};

const stopConversationStream: Lib.Actions["stopConversationStream"] = async ({
  conversation,
}) => {
  const key = Lib.uniqueConversationKey(conversation);
  const stream = conversationStreamsStore.getState().streams[key];

  if (stream === undefined) {
    return { status: 400 };
  }

  if (stream.id !== "success") {
    return { status: 400 };
  }

  try {
    setConversationStream(conversation, { id: "idle" });
    return { status: 200, data: undefined };
  } catch (error) {
    setConversationStream(conversation, { id: "error", error });
    return { status: 500 };
  }
};

const listenToConversationStream: Lib.Actions["listenToConversationStream"] =
  async (conversation, handler) => {
    const key = Lib.uniqueConversationKey(conversation);
    const stream = conversationStreamsStore.getState().streams[key];

    if (stream === undefined) {
      return { status: 400 };
    }

    if (stream.id !== "success") {
      return { status: 400 };
    }

    try {
      stream.data.addHandler(handler);
      return { status: 200, data: undefined };
    } catch (error) {
      setConversationStream(conversation, { id: "error", error });
      return { status: 500 };
    }
  };

/* **************************************************************************
 *
 * FETCH CONVERSATIONS
 *
 * *************************************************************************/

const fetchConversations: Lib.Actions["fetchConversations"] = async () => {
  const client = clientStore.getState().client;

  if (client.id !== "success") {
    return { status: 400 };
  }

  try {
    const conversations = await client.data.conversations.list();
    return {
      status: 200,
      data: conversations.map((c) => Lib.zConversation.parse(c)),
    };
  } catch (error) {
    return { status: 500 };
  }
};

/* **************************************************************************
 *
 * FETCH MESSAGES
 *
 * *************************************************************************/

const fetchMessages: Lib.Actions["fetchMessages"] = async (
  conversation,
  opts
) => {
  const client = clientStore.getState().client;

  if (client.id !== "success") {
    return { status: 400 };
  }

  try {
    const convo = await client.data.conversations.newConversation(
      conversation.peerAddress,
      conversation.context
    );
    const messages = await convo.messages({
      ...opts,
      direction: (() => {
        if (opts?.direction === "ascending") {
          return Sdk.SortDirection.SORT_DIRECTION_ASCENDING;
        } else {
          return Sdk.SortDirection.SORT_DIRECTION_DESCENDING;
        }
      })(),
    });
    return {
      status: 200,
      data: messages.map((message) => Lib.zMessage.parse(message)),
    };
  } catch (error) {
    return { status: 500 };
  }
};

/* **************************************************************************
 *
 * FETCH PEER ON NETWORK
 *
 * *************************************************************************/

const fetchPeerOnNetwork: Lib.Actions["fetchPeerOnNetwork"] = async ({
  peerAddress,
}) => {
  const client = clientStore.getState().client;

  if (client.id !== "success") {
    return { status: 400 };
  }

  try {
    const canMessage = await client.data.canMessage(peerAddress);
    return { status: 200, data: canMessage };
  } catch (error) {
    return { status: 500 };
  }
};

/* **************************************************************************
 *
 * SEND MESSAGE
 *
 * *************************************************************************/

const sendMessage: Lib.Actions["sendMessage"] = async ({
  conversation,
  content,
}) => {
  const client = clientStore.getState().client;

  if (client.id !== "success") {
    return { status: 400 };
  }

  try {
    const convo = await client.data.conversations.newConversation(
      conversation.peerAddress,
      conversation.context
    );
    const sent = await convo.send(content);
    return { status: 200, data: Lib.zMessage.parse(sent) };
  } catch (error) {
    return { status: 500 };
  }
};

Comlink.expose({
  subscribeToClientStore,
  getClient,
  startClient,
  stopClient,
  subscribeToMessagesStreamStore,
  getMessagesStream,
  startMessagesStream,
  stopMessagesStream,
  listenToMessagesStream,
  getConversationsStream,
  subscribeToConversationsStreamStore,
  startConversationsStream,
  stopConversationsStream,
  listenToConversationsStream,
  getConversationStream,
  subscribeToConversationStreamsStore,
  startConversationStream,
  stopConversationStream,
  listenToConversationStream,
  fetchConversations,
  fetchMessages,
  fetchPeerOnNetwork,
  sendMessage,
});

/* **************************************************************************
 *
 * SERIALIZED STREAM
 *
 * *************************************************************************/

class SerializedStream<P, S> {
  private handlers: Record<string, (s: S) => unknown> = {};

  public constructor(
    private stream: Sdk.Stream<P> | AsyncGenerator<P, unknown, unknown>,
    private serializer: (p: P) => S
  ) {
    this.start();
  }

  private async start() {
    for await (const p of this.stream) {
      for (const handler of Object.values(this.handlers)) {
        handler(this.serializer(p));
      }
    }
  }

  public async stop() {
    return this.stream.return(true);
  }

  public addHandler(handler: (s: S) => unknown) {
    const key = this.buildKey();
    this.handlers[key] = handler;
    return key;
  }

  public removeHandler(key: string) {
    if (this.handlers[key] === undefined) {
      return null;
    } else {
      delete this.handlers[key];
      return key;
    }
  }

  public buildKey() {
    return `${Math.random()}${Math.random()}${Math.random()}${Math.random()}`;
  }
}

class MessageStream extends SerializedStream<Sdk.DecodedMessage, Lib.Message> {
  public constructor(
    stream:
      | Sdk.Stream<Sdk.DecodedMessage>
      | AsyncGenerator<Sdk.DecodedMessage, unknown, unknown>
  ) {
    super(stream, (message: Sdk.DecodedMessage) => Lib.zMessage.parse(message));
  }
}

class ConversationStream extends SerializedStream<
  Sdk.Conversation,
  Lib.Conversation
> {
  public constructor(
    stream:
      | Sdk.Stream<Sdk.Conversation>
      | AsyncGenerator<Sdk.Conversation, unknown, unknown>
  ) {
    super(stream, (c) => Lib.zConversation.parse(c));
  }
}
