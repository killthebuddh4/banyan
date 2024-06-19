export const OwnerInstructions = () => {
  return (
    <div className="created">
      <p>Great, you've created a private, secure, and ephemeral groupchat!</p>
      <p>
        <b>Share the URL</b> from the URL bar with whoever you want to invite.
        Anyone with the URL can join.
      </p>
      <p>
        When you're done, close this browser tab. The conversation will be gone
        forever.
      </p>
      <p>
        IMPORTANT: We cannot prevent invited users from recording the
        conversation.
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
