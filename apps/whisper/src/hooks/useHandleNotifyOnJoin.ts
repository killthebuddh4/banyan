import { useWallet } from "@/hooks/useWallet";
import { usePubSub } from "@killthebuddha/fig";
import { store } from "@/brpc/store";
import { useGroupAddressParam } from "@/hooks/useGroupAddressParam";
import { useEffect } from "react";

// NOTE This hook should only be used in Member.tsx

export const useHandleNotifyOnJoin = () => {
  const { wallet } = useWallet();
  const { subscribe } = usePubSub({ wallet, opts: { autoStart: true } });
  const serverAddress = useGroupAddressParam();

  useEffect(() => {
    if (subscribe === null) {
      console.log("WHISPER :: useHandleNotifyOnJoin :: subscribe === null");
      return;
    }

    subscribe((message) => {
      if (message.conversation.peerAddress !== serverAddress) {
        return;
      }

      if (message.conversation.context === undefined) {
        return;
      }

      if (
        message.conversation.context.conversationId !==
        "whisper.banyan.sh/members"
      ) {
        return;
      }

      let members: string[] = [];
      try {
        members = JSON.parse(String(message.content));
      } catch (error) {
        console.error(
          "WHISPER :: useHandleNotifyOnJoin :: error while parsing MEMBER join from server",
        );
        return;
      }

      store.setState((prev) => {
        return { ...prev, members };
      });
    });
  }, [subscribe]);
};
