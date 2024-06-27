import { useGroupMembers } from "@/hooks/useGroupMembers";

export const OwnerInstructions = () => {
  const { members } = useGroupMembers();

  return (
    <div className="created">
      <p>You've created a private, secure, and ephemeral groupchat!</p>
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
      {(() => {
        if (members.length > 0) {
          return (
            <div>
              <b>
                {(() => {
                  if (members.length === 1) {
                    return "1 other person has joined this group.";
                  } else {
                    return `${members.length} other people have joined this group.`;
                  }
                })()}
              </b>
            </div>
          );
        }

        return (
          <div className="nobodyHasJoined">
            Nobody has joined this group yet.
          </div>
        );
      })()}
    </div>
  );
};
