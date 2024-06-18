"use client";

import { useBurnerWallet, useClient, useMessages } from "@killthebuddha/fig";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation.js";

const X =
  "Nobody has joined yet. You'll be able to send messages here once someone joins.";

export const Owner = () => {
  const { get } = useBurnerWallet({});
  const params = useParams();
  const address = params.address;

  if (typeof address !== "string") {
    throw new Error("Invalid address");
  }

  const wallet = (() => {
    const wallet = get({});

    if (wallet === null) {
      throw new Error("Failed to create wallet");
    }

    return wallet;
  })();

  const client = useClient({ wallet });

  const { messages, send } = useMessages({ wallet });

  const [messageInput, setMessageInput] = useState("");

  if (address === undefined) {
    return null;
  }

  const members = (() => {
    const members = new Set<string>();

    for (const message of messages) {
      if (message.senderAddress === wallet.address) {
        continue;
      }

      members.add(message.senderAddress);
    }

    return Array.from(members);
  })();

  return (
    <div className="gc">
      <div className="instructions">
        <p>{wallet.address}</p>
        <p className="">
          You have created a private, secure, and ephemeral groupchat.
        </p>

        <p className="">
          Share the URL in the URL bar with whoever you want to talk to.
        </p>

        <p className="">
          You are the group owner. When you're done, close the tab or refresh
          the page, and the conversation will be gone forever.
        </p>

        <p>
          The other members of the group will be able to see the messages until
          they do the same, but they won't be able to send any more messages.
        </p>

        <p className="">
          <em>IMPORTANT:</em> We cannot prevent the other members of the chat
          from recording the conversation.
        </p>
      </div>

      <div className="groupchat">
        <div className="messages">
          {messages.map((message) => {
            if (message.senderAddress === wallet.address) {
              return (
                <p
                  key={message.id}
                  className="sentByYou"
                >{`${message.content}`}</p>
              );
            } else {
              return <p key={message.id}>{`$${message.content}`}</p>;
            }
          })}
        </div>
        <div className="input">
          <textarea
            placeholder=""
            value={messageInput}
            onChange={(event) => {
              setMessageInput(event.target.value);
            }}
            onKeyDown={async (event) => {
              if (event.key !== "Enter") {
                return;
              }
              if (event.shiftKey) {
                return;
              }

              if (send === null) {
                return;
              }

              console.log(`OWNER :: SENDING TO ${members.length} MEMBERS`);

              await Promise.all(
                members.map((member) =>
                  send({
                    conversation: { peerAddress: member },
                    content: messageInput,
                  }),
                ),
              );

              console.log("OWNER :: SENT ALL");

              event.preventDefault();
              setMessageInput("");
            }}
          />
        </div>
      </div>
    </div>
  );
};
