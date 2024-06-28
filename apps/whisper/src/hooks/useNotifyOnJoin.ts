import { useWallet } from "@/hooks/useWallet";
import { usePubSub } from "@killthebuddha/fig";
import { useGroupMembers } from "@/hooks/useGroupMembers";
import { useEffect } from "react";

// NOTE This hook should only be used in Owner.tsx

export const useNotifyOnJoin = () => {
  const { wallet } = useWallet();
  const { publish } = usePubSub({ wallet, opts: { autoStart: true } });
  const { members } = useGroupMembers();

  useEffect(() => {
    (async () => {
      if (publish === null) {
        return;
      }

      console.log("WHISPER :: useNotifyOnJoin :: broadcasting join");

      const sent = await Promise.all(
        members.map((member) => {
          return publish({
            conversation: {
              peerAddress: member,
              context: {
                conversationId: "whisper.banyan.sh/members",
                metadata: {},
              },
            },
            content: JSON.stringify(members),
          });
        }),
      );

      console.log("WHISPER :: useNotifyOnJoin :: broadcasted join", sent);
    })();
  }, [publish, members]);
};
