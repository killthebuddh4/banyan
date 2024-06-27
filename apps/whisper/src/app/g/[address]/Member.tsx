import { App } from "@/components/App";
import { useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useLogin, useBrpcClient, usePubSub } from "@killthebuddha/fig";
import { Messages } from "@/components/Messages";
import { Input } from "@/components/Input";
import { join } from "@/brpc/join";
import { members } from "@/brpc/members";
import { keepalive } from "@/brpc/keepalive";
import { useGroupAddressParam } from "@/hooks/useGroupAddressParam";
import { store } from "@/brpc/store";

const api = {
  join,
  members,
  keepalive,
};

export const Member = () => {
  const { wallet, create } = useWallet();

  useLogin({ wallet, opts: { autoLogin: true, env: "production" } });
  const { subscribe } = usePubSub({ wallet, opts: { autoStart: true } });
  const serverAddress = useGroupAddressParam();
  const brpc = useBrpcClient({ wallet, api, serverAddress });

  console.log("WHISPER :: Member.tsx :: brpc", brpc);

  useEffect(() => {
    if (subscribe === null) {
      console.log("WHISPER :: Member.tsx :: subscribe === null");
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
          "WHISPER :: Member.tsx :: error while parsing MEMBER join from server",
        );
        return;
      }

      store.setState((prev) => {
        return {
          ...prev,
          members: members,
        };
      });
    });
  }, [subscribe]);

  useEffect(() => {
    if (wallet === undefined) {
      return;
    }

    store.setState((prev) => {
      const found = prev.members.find((member) => member === wallet.address);

      if (found !== undefined) {
        return prev;
      }

      return {
        ...prev,
        members: [...prev.members, wallet.address],
      };
    });
  }, []);

  useEffect(() => {
    create();
  }, []);

  useEffect(() => {
    if (brpc === null) {
      console.log("WHISPER :: Member.tsx :: brpc === null");
      return;
    }

    const joined = brpc.join();

    console.log("WHISPER :: Member.tsx :: joined", joined);
  }, [brpc]);

  return (
    <App>
      <Messages />
      <Input />
    </App>
  );
};
