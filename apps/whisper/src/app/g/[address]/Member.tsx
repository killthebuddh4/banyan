import { App } from "@/components/App";
import { useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useLogin } from "@killthebuddha/fig";
import { usePubSub } from "@killthebuddha/fig";
import { Messages } from "@/components/Messages";
import { Input } from "@/components/Input";

export const Member = () => {
  const { wallet, create } = useWallet();

  useLogin({ wallet, opts: { autoLogin: true, env: "production" } });
  usePubSub({ wallet, opts: { autoStart: true } });

  useEffect(() => {
    create();
  }, []);

  return (
    <App>
      <Messages />
      <Input />
    </App>
  );
};
