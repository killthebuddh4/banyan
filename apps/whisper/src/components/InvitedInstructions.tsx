import { useGroupMembers } from "@/hooks/useGroupMembers";

export const InvitedInstructions = () => {
  const { members } = useGroupMembers();

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
      {(() => {
        if (members.length === 0) {
          console.warn(
            "There are no members in this group even though you are a member.",
          );
          return null;
        }

        return (
          <div>
            <b>
              {(() => {
                if (members.length === 1) {
                  return "There is 1 other person in this group.";
                } else {
                  return `There are ${members.length} other people are in this group.`;
                }
              })()}
            </b>
          </div>
        );
      })()}
    </div>
  );
};
