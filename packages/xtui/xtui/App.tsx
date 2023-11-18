import React from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import { createXmtp } from "./createXmtp.js";
import { DecodedMessage } from "@xmtp/xmtp-js";

type MH = ({ message }: { message: DecodedMessage }) => void;

type M = {
  id: string;
  senderAddress: string;
  content: string;
};

type P = ({ content }: { content: string }) => Promise<unknown>;

type S = ({ handler }: { handler: MH }) => void;

let c = false;

export const App = ({ pk, peer }: { pk: string; peer: string }) => {
  const [messages, setMessages] = React.useState<M[]>([]);
  const [publish, setPublish] = React.useState<P | null>(null);
  const [subscribe, setSubscribe] = React.useState<S | null>(null);
  const [input, setInput] = React.useState("");
  const [client, setClient] = React.useState<{ address: string } | null>(null);

  React.useEffect(() => {
    if (subscribe !== null) {
      subscribe({
        handler: ({ message }) => {
          setMessages((messages) => {
            const existing = messages.find((m) => m.id === message.id);
            if (existing !== undefined) {
              return messages;
            }
            return [
              ...messages,
              {
                id: message.id,
                senderAddress: message.senderAddress,
                content: message.content,
              },
            ];
          });
        },
      });
    }
  }, [subscribe]);

  React.useEffect(() => {
    if (c) {
      return;
    } else {
      c = true;
    }

    (async () => {
      const xmtp = await createXmtp({
        pk,
        peer,
      });

      setPublish(() => xmtp.publish);
      setSubscribe(() => xmtp.subscribe);
      setClient(() => xmtp.client);
    })();
  }, []);

  return (
    <Box flexDirection="column" width={80}>
      {messages.map((m) => (
        <Box
          marginLeft={(() => {
            if (client === null) {
              return 0;
            } else if (m.senderAddress === client.address) {
              return 38;
            } else {
              return 0;
            }
          })()}
          flexDirection="column"
          justifyContent={(() => {
            if (client === null) {
              return "flex-start";
            } else if (m.senderAddress === client.address) {
              return "flex-end";
            } else {
              return "flex-start";
            }
          })()}
          key={m.id}
        >
          <Text
            color={(() => {
              if (client === null) {
                return "white";
              } else if (m.senderAddress === client.address) {
                return "blue";
              } else {
                return "green";
              }
            })()}
          >
            {m.senderAddress}
          </Text>
          <Text>{m.content}</Text>
        </Box>
      ))}
      <Box
        borderColor="blue"
        borderStyle="single"
        marginTop={1}
        paddingLeft={1}
        paddingRight={1}
      >
        <TextInput
          value={input}
          showCursor={true}
          onChange={setInput}
          onSubmit={() => {
            if (input.length > 0 && publish !== null) {
              publish({ content: input });
              setInput("");
            }
          }}
        />
      </Box>
    </Box>
  );
};
