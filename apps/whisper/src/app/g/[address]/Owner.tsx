"use client";

import { useBurnerWallet, useClient } from "@killthebuddha/fig";
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

  useEffect(() => {
    if (client === null) {
      return;
    }

    if (client.start === null) {
      return;
    }

    client.start();
  }, [client]);

  const [messageInput, setMessageInput] = useState("");

  if (address === undefined) {
    return null;
  }

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
          <p>
            Nobody has joined yet. Messages will appear here after others join.
          </p>
        </div>
        <div className="input">
          <textarea
            placeholder=""
            value={messageInput === "" ? X : messageInput}
            onChange={(event) => {
              setMessageInput(event.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};
