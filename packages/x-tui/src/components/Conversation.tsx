import React, { useEffect } from "react";
import { Box, Text } from "ink";
import { MessageInput } from "./MessageInput.js";
import { clientStore } from "../xmtp/client/clientStore.js";
import { useClient } from "../xmtp/client/useClient.js";
import { messageStreamStore } from "../xmtp/message-stream/messageStreamStore.js";
import { useStream } from "../xmtp/message-stream/useStream.js";
import { messageStore } from "../xmtp/messages/messageStore.js";
import { useMessages } from "../xmtp/messages/useMessages.js";

export const Conversation = ({
  pk,
  peerAddress,
}: {
  pk: string;
  peerAddress: string;
}) => {
  const { client, start: clientStart } = useClient({ store: clientStore });

  const { stream, start: streamStart } = useStream({
    store: messageStreamStore,
    forPeerAddress: peerAddress,
  });

  const { messages, set } = useMessages({
    store: messageStore,
    forPeerAddress: peerAddress,
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
    if (stream === undefined) {
      return;
    }

    (async () => {
      for await (const message of stream) {
        set({ message });
      }
    })();
  }, [stream]);

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
        <Text>(press</Text>
        <Text color="green">enter</Text>
        <Text>to send, you can use</Text>
        <Text color="green">tab</Text>
        <Text>to view your conversations)</Text>
      </Box>
      <Box flexDirection="row" rowGap={0} columnGap={1} flexWrap="wrap">
        <Text>Send a message to</Text>
        <Text color="green">{peerAddress}</Text>
      </Box>
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
