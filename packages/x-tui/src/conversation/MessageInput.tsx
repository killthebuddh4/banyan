import React, { useState, useMemo } from "react";
import { Text, Box } from "ink";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";
import { conversationStore } from "../xmtp/conversation-list/conversationStore.js";
import { useConversation } from "../xmtp/conversation-list/useConversation.js";
import { messageStore } from "../xmtp/messages/messageStore.js";
import { useMessages } from "../xmtp/messages/useMessages.js";

export const MessageInput = ({ peerAddress }: { peerAddress: string }) => {
  const [input, setInput] = React.useState("");

  const { conversation } = useConversation({
    store: conversationStore,
    peerAddress,
  });

  const { messages } = useMessages({
    store: messageStore,
    forPeerAddress: peerAddress,
  });

  const [lastSentId, setLastSentId] = useState<string | null | undefined>(
    undefined,
  );

  const isSending = useMemo(() => {
    if (lastSentId === undefined) {
      return false;
    }
    if (lastSentId === null) {
      return true;
    }
    return messages.find((m) => m.id === lastSentId) === undefined;
  }, [lastSentId, messages]);

  return (
    <Box marginTop={1} paddingRight={1}>
      <Text>{"> "}</Text>
      <TextInput
        value={input}
        showCursor={!isSending}
        onChange={setInput}
        onSubmit={async () => {
          if (conversation === undefined) {
            setInput("undefined");
            return;
          }
          if (input.length === 0) {
            setInput("0");
            return;
          }

          setLastSentId(null);
          const sent = await conversation.send(input);
          setLastSentId(sent.id);
          setInput("");
        }}
      />
      {isSending ? <Text> </Text> : null}
      {isSending ? <Spinner /> : null}
    </Box>
  );
};
