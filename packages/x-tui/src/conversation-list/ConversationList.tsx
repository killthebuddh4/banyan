import React, { useEffect } from "react";
import { Box, Text, useInput } from "ink";
import { setRoute } from "../router/setRoute.js";
import { routerStore } from "../router/routerStore.js";
import Spinner from "ink-spinner";
import { clientStore } from "../xmtp/client/clientStore.js";
import { useClient } from "../xmtp/client/useClient.js";
import { conversationStreamStore } from "../xmtp/conversation-stream/conversationStreamStore.js";
import { useStream } from "../xmtp/conversation-stream/useStream.js";
import { conversationStore } from "../xmtp/conversation-list/conversationStore.js";
import { useConversationList } from "../xmtp/conversation-list/useConversationList.js";

export const ConversationList = ({ pk }: { pk: string }) => {
  const { client, start: clientStart } = useClient({ store: clientStore });

  const { stream, start: streamStart } = useStream({
    store: conversationStreamStore,
  });

  const { list, add } = useConversationList({
    store: conversationStore,
  });

  useEffect(() => {
    clientStart({ pk });
  }, [client, pk]);

  useEffect(() => {
    if (client === undefined) {
      return;
    }
    streamStart({ client });
  }, [client, stream]);

  useEffect(() => {
    if (stream === null) {
      return;
    }

    (async () => {
      for await (const conversation of stream) {
        add({ conversations: [conversation] });
      }
    })();
  }, [stream]);

  useEffect(() => {
    if (client === undefined) {
      return;
    }

    client.conversations.list().then((conversations) => {
      add({ conversations });
      setIsLoading(false);
    });
  }, [client]);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [selectedConversation, setSelectedConversation] = React.useState<{
    peerAddress: string;
  } | null>(null);

  useEffect(() => {
    if (list.length === 0) {
      return;
    }

    const conversation = list[0];
    if (conversation === undefined) {
      throw new Error(
        "Conversation is undefined but we thought we guaranteed it would not be.",
      );
    }
    setSelectedConversation(conversation);
  }, [list.length === 0]);

  useInput((input, key) => {
    if (key.upArrow || input === "k") {
      setSelectedConversation((prev) => {
        if (prev === null) {
          return null;
        }

        if (list.length === 0) {
          return null;
        }

        const prevIdx = list.findIndex(
          (c) => c.peerAddress === prev.peerAddress,
        );

        const conversation = list[Math.max(0, prevIdx - 1)];

        if (conversation === undefined) {
          throw new Error(
            "Conversation is undefined but we thought we guaranteed it would not be.",
          );
        }

        return conversation;
      });
    } else if (key.downArrow || input === "j") {
      setSelectedConversation((prev) => {
        if (list.length === 0) {
          return null;
        }

        if (prev === null) {
          const conversation = list[0];
          if (conversation === undefined) {
            throw new Error(
              "Conversation is undefined but we thought we guaranteed it would not be.",
            );
          }
          return conversation;
        }

        const prevIdx = list.findIndex(
          (c) => c.peerAddress === prev.peerAddress,
        );

        const conversation = list[Math.min(list.length - 1, prevIdx + 1)];

        if (conversation === undefined) {
          throw new Error(
            "Conversation is undefined but we thought we guaranteed it would not be.",
          );
        }

        return conversation;
      });
    } else if (key.return) {
      if (selectedConversation === null) {
        return;
      }

      setRoute({
        store: routerStore,
        route: {
          route: "conversation",
          conversation: { peerAddress: selectedConversation.peerAddress },
        },
      });
    }
  });

  return (
    <Box flexDirection="column" width={80}>
      <Box marginBottom={1} flexDirection="row" gap={1}>
        <Text>Thanks for using xm, the XMTP manager:</Text>
        <Text underline={true}>https://github.com/banyan-sh/xm</Text>
      </Box>
      <Box marginBottom={1} flexDirection="row" gap={1}>
        <Text>You can learn more about XMTP at</Text>
        <Text underline={true}>https://xmtp.org</Text>
      </Box>
      <Box marginBottom={1} flexDirection="row" gap={1}>
        <Text>(use</Text>
        <Text color="green">up/down/j/k</Text>
        <Text>to select, and</Text>
        <Text color="green">enter</Text>
        <Text>to navigate)</Text>
      </Box>
      <Box marginBottom={1} flexDirection="row" gap={1}>
        {isLoading && (
          <>
            <Text color="yellow">Loading conversations</Text>
            <Spinner />
          </>
        )}
        {isLoading || (
          <>
            <Text>Your conversations:</Text>
          </>
        )}
      </Box>
      {list.map((c) => {
        const color =
          c.peerAddress === selectedConversation?.peerAddress
            ? "green"
            : "white";
        return (
          <Box
            flexDirection="column"
            key={c.peerAddress + c.context?.conversationId}
          >
            <Text color={color}>{c.peerAddress}</Text>
          </Box>
        );
      })}
    </Box>
  );
};
