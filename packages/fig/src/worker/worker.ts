import "../polyfills.js";
import * as Comlink from "comlink";
import * as Xmtp from "@xmtp/xmtp-js";
import { clientStore } from "./clientStore.js";
import { globalMessageStreamStore } from "./globalMessageStreamStore.js";
import { conversationMessageStreamStore } from "./conversationMessageStreamStore.js";
import { conversationStreamStore } from "./conversationStreamStore.js";
import { AsyncHandler } from "./AsyncHandler.js";
import { Message } from "./Message.js";
import { Conversation } from "./Conversation.js";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { buildUniqueConversationKey } from "./buildUniqueConversationKey.js";
import { fetchConversations } from "./fetchConversations.js";
import { fetchMessages } from "./fetchMessages.js";
import { fetchPeerOnNetwork } from "./fetchPeerOnNetwork.js";
import { sendMessage } from "./sendMessage.js";

/* **************************************************************************
 *
 * CLIENT
 *
 * *************************************************************************/

const subscribeToClientStore = (args: {
  onChange: AsyncHandler<undefined>;
}) => {
  clientStore.subscribe((state) => {
    const client = { ...state.client, data: undefined };
    args.onChange(client);
  });
};

const getClient = () => {
  const client = {
    ...clientStore.client(),
    data: undefined,
  };

  return client;
};

/* **************************************************************************
 *
 * MESSAGES STREAM
 *
 * *************************************************************************/

const subscribeToGlobalMessageStreamStore = (args: {
  onChange: AsyncHandler<undefined>;
}) => {
  globalMessageStreamStore.subscribe((state) => {
    const stream = { ...state.stream, data: undefined };
    args.onChange(stream);
  });
};

const getGlobalMessagesStream = () => {
  const stream = {
    ...globalMessageStreamStore.stream(),
    data: undefined,
  };

  return stream;
};

const listenToGlobalMessagesStream = (handler: (message: Message) => void) => {
  globalMessageStreamStore.listen((message: DecodedMessage) => {
    return handler({
      id: message.id,
      content: message.content,
      senderAddress: message.senderAddress,
      sent: message.sent,
      conversation: {
        peerAddress: message.conversation.peerAddress,
        context: message.conversation.context,
      },
    });
  });
};

const subscribeToConversationStreamStore = (args: {
  onChange: AsyncHandler<undefined>;
}) => {
  conversationStreamStore.subscribe((state) => {
    const stream = { ...state.stream, data: undefined };
    args.onChange(stream);
  });
};

const getConversationStream = () => {
  const stream = {
    ...conversationStreamStore.stream(),
    data: undefined,
  };

  return stream;
};

const listenToConversationStream = async (
  handler: (c: Conversation) => void
) => {
  conversationStreamStore.listen((conversation: Xmtp.Conversation) => {
    return handler({
      peerAddress: conversation.peerAddress,
      context: conversation.context,
    });
  });
};

const subscribeToConversationMessageStreamStore = (args: {
  conversation: Conversation;
  onChange: AsyncHandler<undefined>;
}) => {
  const id = buildUniqueConversationKey(args.conversation);
  conversationMessageStreamStore.subscribe(() => {
    const stream = {
      ...conversationMessageStreamStore.stream(id),
      data: undefined,
    };
    args.onChange(stream);
  });
};

const getConversationMessageStream = (conversation: Conversation) => {
  const id = buildUniqueConversationKey(conversation);
  const stream = {
    ...conversationMessageStreamStore.stream(id),
    data: undefined,
  };
  return stream;
};

const listenToConversationMessageStream = async (
  conversation: Conversation,
  handler: (m: Message) => void
) => {
  conversationMessageStreamStore.listen(
    conversation,
    (message: DecodedMessage) => {
      handler({
        id: message.id,
        content: message.content,
        senderAddress: message.senderAddress,
        sent: message.sent,
        conversation: {
          peerAddress: message.conversation.peerAddress,
          context: message.conversation.context,
        },
      });
    }
  );
};

Comlink.expose({
  subscribeToClientStore,
  getClient,
  startClient: clientStore.start,
  stopClient: clientStore.stop,
  subscribeToGlobalMessageStreamStore,
  getGlobalMessagesStream,
  startGlobalMessagesStream: globalMessageStreamStore.start,
  stopGlobalMessagesStream: globalMessageStreamStore.stop,
  listenToGlobalMessagesStream,
  subscribeToConversationStreamStore,
  getConversationStream,
  startConversationStream: conversationStreamStore.start,
  stopConversationStream: conversationStreamStore.stop,
  listenToConversationStream,
  subscribeToConversationMessageStreamStore,
  getConversationMessageStream,
  startConversationMessageStream: conversationMessageStreamStore.start,
  stopConversationMessageStream: conversationMessageStreamStore.stop,
  listenToConversationMessageStream,
  fetchConversations,
  fetchMessages,
  fetchPeerOnNetwork,
  sendMessage,
});
