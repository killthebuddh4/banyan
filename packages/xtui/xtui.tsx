import React from "react";
import { render, Box, Text } from "ink";
import TextInput from "ink-text-input";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import crypto from "crypto";

const wallet = new Wallet(process.env["XTUI_PK"] as string);

const client = await Client.create(wallet, { env: "production" });

const conversation = await client.conversations.newConversation(
  process.env["XTUI_PEER_ADDRESS"] as string,
);

const stream = await conversation.streamMessages();

const store = {
  handlers: new Map<string, () => void>(),
  index: new Map<string, DecodedMessage>(),
  messages: [] as DecodedMessage[],
};

(async () => {
  for await (const message of stream) {
    store.index.set(message.id, message);
    store.messages = Array.from(store.index.values());
    for (const handler of store.handlers.values()) {
      handler();
    }
  }
})();

export const App = () => {
  const messages = React.useSyncExternalStore(
    (handler) => {
      const id = crypto.randomUUID();
      store.handlers.set(id, handler);
      return () => store.handlers.delete(id);
    },
    () => store.messages,
  );

  const height = React.useSyncExternalStore(
    (handler) => {
      process.on('resize', handler);
      return () => process.removeListener('resize', handler);
    },
    () => process.stdout.rows,
  );


  const [input, setInput] = React.useState("");

  return (
    <Box flexDirection="column" height={height} width={80}>
      <Box flexDirection="column" flexGrow={1}>
        {messages.map((m) => {
          const color = m.senderAddress === client.address ? "blue" : "green";
          return (
            <Box flexDirection="column" marginTop={1} key={m.id}>
              <Text color={color}>{m.senderAddress}</Text>
              <Text>{m.content}</Text>
            </Box>
          );
        })}
      </Box>

      <Box borderStyle="single" marginTop={1} paddingLeft={1} paddingRight={1}>
        <TextInput
          value={input}
          showCursor={true}
          onChange={setInput}
          onSubmit={() => {
            if (input.length > 0) {
              conversation.send(input);
              setInput("");
            }
          }}
        />
      </Box>
    </Box>
  );
};

console.clear();

render(<App />);
