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

const api = {
  join,
  members,
  keepalive,
};

export const Member = () => {
  const { wallet, create } = useWallet();

  useLogin({ wallet, opts: { autoLogin: true, env: "production" } });
  usePubSub({ wallet, opts: { autoStart: true } });
  const serverAddress = useGroupAddressParam();
  const brpc = useBrpcClient({ wallet, api, serverAddress });

  console.log("WHISPER :: Member.tsx :: brpc", brpc);

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
