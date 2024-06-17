"use client";

import { useBurnerWallet } from "@killthebuddha/fig";

export default function Home() {
  const { create, get } = useBurnerWallet({});

  return (
    <div className="app">
      <div className="instructions">
        <p className="clickBelow">
          Click the button below to create a private, secure, and ephemeral
          groupchat.
        </p>
        <p className="shareLink">
          Once the groupchat is created, we'll give you a URL to share with
          whoever you want to talk to.
        </p>
        <p className="closeTheTab">
          When you're done, close the tab or refresh the page, and the
          conversation will be gone forever.{" "}
        </p>
        <p className="warning">
          <em>IMPORTANT:</em> We cannot prevent the other members of the chat
          from recording the conversation.
        </p>
      </div>

      <button onClick={() => console.log("COOL")} className="create">
        Create Groupchat
      </button>
    </div>
  );
}
