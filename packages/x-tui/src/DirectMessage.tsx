import React, { useEffect, useSyncExternalStore } from "react";
import { Box, Text } from "ink";
import { MessageInput } from "./MessageInput.js";
import * as Xmtp from "./xmtp.js";

export const DirectMessage = ({
  pk,
  peerAddress,
}: {
  pk: string;
  peerAddress: string;
}) => {
  const client = useSyncExternalStore(
    Xmtp.subscribeToClientStore,
    Xmtp.getClient,
  );

  const conversation = useSyncExternalStore(
    Xmtp.subscribeToConversationStore,
    () => Xmtp.getConversation({ peerAddress }),
  );

  const stream = useSyncExternalStore(
    // prettier
    Xmtp.subscribeToStreamStore,
    () => Xmtp.getStream({ peerAddress }),
  );

  const messages = useSyncExternalStore(
    // prettier
    Xmtp.subscribeToMessageStore,
    () => Xmtp.getMessages({ peerAddress }),
  );

  useEffect(() => {
    if (client !== undefined) {
      return;
    }

    Xmtp.startClient({ pk });
  }, [client, pk]);

  useEffect(() => {
    if (client === undefined) {
      return;
    }

    Xmtp.startConversation({ peerAddress });
  }, [client, peerAddress]);

  useEffect(() => {
    if (conversation === undefined) {
      return;
    }

    Xmtp.startStream({ peerAddress });
  }, [conversation]);

  useEffect(() => {
    if (stream === undefined) {
      return;
    }

    (async () => {
      for await (const message of stream) {
        Xmtp.setMessage({ message });
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
        {messages.map((m) => {
          const color = m.senderAddress === peerAddress ? "green" : "blue";
          return (
            <Box flexDirection="column" marginTop={1} key={m.id}>
              <Text color={color}>{m.senderAddress}</Text>
              <Text>{m.content}</Text>
            </Box>
          );
        })}
      </Box>
      <MessageInput peerAddress={peerAddress} />
    </Box>
  );
};
