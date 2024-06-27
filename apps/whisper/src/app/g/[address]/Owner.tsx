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
import { useNotifyOnJoin } from "@/hooks/useNotifyOnJoin";

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
  useNotifyOnJoin();

  return (
    <App>
      <Messages />
      <Input />
    </App>
  );
};
