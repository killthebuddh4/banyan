export const InvitedInstructions = () => {
  return (
    <div className="created">
      <p>You've joined a private, secure, and ephemeral groupchat!</p>

      <p>
        If you close the browser tab, you can rejoin, but you won't see any of
        the previous messages.
      </p>
      <p>
        IMPORTANT: We cannot prevent the other members of the chat from
        recording the conversation.
      </p>
      <div>
        <em>
          If you'd like to learn more about how this works, click{" "}
          <a href="/about">here</a>.
        </em>
      </div>
    </div>
  );
};
