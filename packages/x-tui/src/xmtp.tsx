import { Wallet } from "@ethersproject/wallet";
import { Client, DecodedMessage, Conversation, Stream } from "@xmtp/xmtp-js";
import crypto from "crypto";

const clientStore = {
  handlers: new Map<string, () => void>(),
  client: undefined as Client | undefined,
};

export const subscribeToClientStore = (handler: () => unknown) => {
  const id = crypto.randomUUID();
  clientStore.handlers.set(id, handler);
  return () => clientStore.handlers.delete(id);
};

export const getClient = () => clientStore.client;

export const setClient = ({ client }: { client: Client }) => {
  if (clientStore.client !== undefined) {
    return;
  }

  clientStore.client = client;

  for (const handler of clientStore.handlers.values()) {
    handler();
  }
};

export const startClient = async ({ pk }: { pk: string }) => {
  if (clientStore.client !== undefined) {
    return;
  }

  const wallet = new Wallet(pk);

  const client = await Client.create(wallet, { env: "production" });

  console.error("Started client address :", client.address);

  setClient({ client });
};

const conversationStreamStore = {
  handlers: new Map<string, () => void>(),
  stream: undefined as Stream<Conversation> | undefined,
};

export const subscribeToConversationStreamStore = (handler: () => unknown) => {
  const id = crypto.randomUUID();
  conversationStreamStore.handlers.set(id, handler);
  return () => conversationStreamStore.handlers.delete(id);
};

export const getConversationStream = () => {
  return conversationStreamStore.stream;
};

export const setConversationStream = ({
  stream,
}: {
  stream: Stream<Conversation>;
}) => {
  if (conversationStreamStore.stream !== undefined) {
    return;
  }

  conversationStreamStore.stream = stream;

  for (const handler of conversationStreamStore.handlers.values()) {
    handler();
  }
};

export const startConversationStream = async () => {
  if (conversationStreamStore.stream !== undefined) {
    return;
  }

  if (clientStore.client === undefined) {
    throw new Error("client is null");
  }

  const stream = await clientStore.client.conversations.stream();

  setConversationStream({ stream });
};

const conversationsStore = {
  handlers: new Map<string, () => void>(),
  index: new Map<string, Conversation>(),
  conversations: [] as Conversation[],
};

export const subscribeToConversationStore = (handler: () => unknown) => {
  const id = crypto.randomUUID();
  conversationsStore.handlers.set(id, handler);
  return () => conversationsStore.handlers.delete(id);
};

export const getConversations = () => conversationsStore.conversations;

export const getConversation = ({ peerAddress }: { peerAddress: string }) => {
  return conversationsStore.index.get(peerAddress);
};

export const setConversation = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  if (conversationsStore.index.has(conversation.peerAddress)) {
    return;
  }

  conversationsStore.index.set(conversation.peerAddress, conversation);
  conversationsStore.conversations = Array.from(
    conversationsStore.index.values(),
  );

  for (const handler of conversationsStore.handlers.values()) {
    handler();
  }
};

export const startConversation = async ({
  peerAddress,
}: {
  peerAddress: string;
}) => {
  if (conversationsStore.index.has(peerAddress)) {
    return;
  }

  if (clientStore.client === undefined) {
    throw new Error("client is null");
  }

  console.error("Starting conversation with", peerAddress);

  const conversation =
    await clientStore.client.conversations.newConversation(peerAddress);

  setConversation({ conversation });
};

const streamStore = {
  handlers: new Map<string, () => void>(),
  streams: new Map<string, Stream<DecodedMessage>>(),
};

export const subscribeToStreamStore = (handler: () => unknown) => {
  const id = crypto.randomUUID();
  streamStore.handlers.set(id, handler);
  return () => streamStore.handlers.delete(id);
};

export const setStream = ({
  peerAddress,
  stream,
}: {
  peerAddress: string;
  stream: Stream<DecodedMessage>;
}) => {
  if (streamStore.streams.has(peerAddress)) {
    return;
  }

  streamStore.streams.set(peerAddress, stream);

  for (const handler of streamStore.handlers.values()) {
    handler();
  }
};

export const startStream = async ({ peerAddress }: { peerAddress: string }) => {
  if (streamStore.streams.has(peerAddress)) {
    return;
  }

  const conversation = conversationsStore.index.get(peerAddress);

  if (conversation === undefined) {
    throw new Error("conversation not found");
  }

  const stream = await conversation.streamMessages();

  setStream({ peerAddress, stream });
};

export const getStream = ({ peerAddress }: { peerAddress: string }) => {
  return streamStore.streams.get(peerAddress);
};

const messageStore = {
  handlers: new Map<string, () => void>(),
  index: new Map<string, Map<string, DecodedMessage>>(),
  messages: new Map<string, DecodedMessage[]>(),
};

export const subscribeToMessageStore = (handler: () => unknown) => {
  const id = crypto.randomUUID();
  messageStore.handlers.set(id, handler);
  return () => messageStore.handlers.delete(id);
};

export const getMessages = ({ peerAddress }: { peerAddress: string }) => {
  let messages = messageStore.messages.get(peerAddress);

  if (messages === undefined) {
    messageStore.messages.set(peerAddress, []);
  }

  messages = messageStore.messages.get(peerAddress);

  if (messages === undefined) {
    throw new Error("messages is undefined even though we just set it");
  }

  return messages;
};

export const setMessage = ({ message }: { message: DecodedMessage }) => {
  if (!messageStore.index.has(message.conversation.peerAddress)) {
    messageStore.index.set(message.conversation.peerAddress, new Map());
  }

  const subIndex = messageStore.index.get(message.conversation.peerAddress);
  if (subIndex === undefined) {
    throw new Error("messages is undefined even though we just set it");
  }

  subIndex.set(message.id, message);
  messageStore.messages.set(
    message.conversation.peerAddress,
    Array.from(subIndex.values()),
  );

  for (const handler of messageStore.handlers.values()) {
    handler();
  }
};
