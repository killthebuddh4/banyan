import { App } from "@/components/App";
import { useWallet } from "@/hooks/useWallet";
import { useLogin, useBrpcServer, usePubSub } from "@killthebuddha/fig";
import { Messages } from "@/components/Messages";
import { Input } from "@/components/Input";
import { join } from "@/brpc/join";
import { members } from "@/brpc/members";
import { keepalive } from "@/brpc/keepalive";
import { useGroupMembers } from "@/hooks/useGroupMembers";
import { useEffect } from "react";

const api = {
  join,
  members,
  keepalive,
};

export const Owner = () => {
  const { wallet } = useWallet();

  if (wallet === undefined) {
    throw new Error("WHISPER :: Owner.tsx :: wallet === undefined");
  }

  useLogin({ wallet, opts: { autoLogin: true, env: "production" } });
  useBrpcServer({ wallet, api });

  const { publish } = usePubSub({ wallet, opts: { autoStart: true } });

  const { members } = useGroupMembers();

  useEffect(() => {
    (async () => {
      if (publish === null) {
        return;
      }

      console.log("WHISPER :: Owner.tsx :: broadcasting join");

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

      console.log("WHISPER :: Owner.tsx :: broadcasted join", sent);
    })();
  }, [publish, members]);

  return (
    <App>
      <Messages />
      <Input />
    </App>
  );
};
