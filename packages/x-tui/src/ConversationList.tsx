import React, { useEffect, useSyncExternalStore } from "react";
import { Box, Text } from "ink";
import * as Xmtp from "./xmtp.js";

export const ConversationList = ({ pk }: { pk: string }) => {
  const client = useSyncExternalStore(
    Xmtp.subscribeToClientStore,
    Xmtp.getClient,
  );

  console.error("client is ", client?.address);

  const stream = useSyncExternalStore(
    // prettier
    Xmtp.subscribeToConversationStreamStore,
    () => Xmtp.getConversationStream(),
  );

  const conversations = useSyncExternalStore(
    // prettier
    Xmtp.subscribeToConversationStore,
    () => Xmtp.getConversations(),
  );

  useEffect(() => {
    if (client !== undefined) {
      return;
    }

    console.error("starting client");
    Xmtp.startClient({ pk });
  }, [client, pk]);

  useEffect(() => {
    if (client === undefined) {
      return;
    }

    client.conversations.list().then((conversations) => {
      for (const conversation of conversations) {
        Xmtp.setConversation({ conversation });
      }
    });
  }, [client]);

  useEffect(() => {
    if (client === undefined) {
      return;
    }

    if (stream !== undefined) {
      return;
    }

    console.error("starting conversation stream");
    Xmtp.startConversationStream();
  }, [client]);

  useEffect(() => {
    if (stream === undefined) {
      return;
    }

    (async () => {
      for await (const conversation of conversations) {
        Xmtp.setConversation({ conversation });
      }
    })();
  }, [stream]);

  const height = React.useSyncExternalStore(
    (handler) => {
      process.on("resize", handler);
      return () => process.removeListener("resize", handler);
    },
    () => process.stdout.rows,
  );

  return (
    <Box flexDirection="column" height={height} width={65}>
      <Box flexDirection="column" flexGrow={1}>
        {conversations.map((c, idx) => {
          const color = idx % 2 === 0 ? "yellow" : "white";
          return (
            <Box
              flexDirection="column"
              marginTop={1}
              key={c.peerAddress + c.context?.conversationId}
            >
              <Text color={color}>{c.peerAddress}</Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
