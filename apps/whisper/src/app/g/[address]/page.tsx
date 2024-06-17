"use client";

export default function Groupchat() {
  return (
    <div className="app gc">
      <div className="instructions">
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
          Nobody has joined yet. You'll be able to send messages here once
          someone joins.
        </div>
      </div>
    </div>
  );
}
