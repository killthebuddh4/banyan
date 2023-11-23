import React, { useSyncExternalStore, useState, useMemo } from "react";
import { Box } from "ink";
import TextInput from "ink-text-input";
import * as Xmtp from "./xmtp.js";

export const MessageInput = ({ peerAddress }: { peerAddress: string }) => {
  const [input, setInput] = React.useState("");
  const [lastSentId, setLastSentId] = useState<string | null>(null);

  const conversation = useSyncExternalStore(
    Xmtp.subscribeToConversationStore,
    () => Xmtp.getConversation({ peerAddress }),
  );

  const messages = useSyncExternalStore(
    // prettier
    Xmtp.subscribeToMessageStore,
    () => Xmtp.getMessages({ peerAddress }),
  );

  const isLastSentSuccess: boolean | null = useMemo(() => {
    if (lastSentId === null) {
      return null;
    }
    const lastSent = messages.find((m) => m.id === lastSentId);

    return lastSent !== undefined;
  }, [lastSentId, messages]);

  return (
    <Box
      borderStyle="single"
      borderColor={(() => {
        if (isLastSentSuccess === false) {
          return "yellow";
        } else {
          return "white";
        }
      })()}
      marginTop={1}
      paddingLeft={1}
      paddingRight={1}
    >
      <TextInput
        value={input}
        showCursor={true}
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

          const sent = await conversation.send(input);
          setLastSentId(sent.id);
          setInput("");
        }}
      />
    </Box>
  );
};
