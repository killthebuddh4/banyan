import { App } from "@/components/App";
import { Messages } from "@/components/Messages";
import { useGroupMember } from "@/hooks/useGroupMember";
import { useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";

export const Member = () => {
  const { wallet, create } = useWallet();
  const client = useGroupMember();

  useEffect(() => {
    create();
  }, []);

  useEffect(() => {
    (async () => {
      if (client === null) {
        return;
      }

      if (wallet === undefined) {
        return;
      }

      const result = await client.join(wallet.address);

      console.log("MEMBER :: await client.join(wallet.address)", result);
    })();
  }, [client, wallet]);

  return (
    <App>
      <Messages />
    </App>
  );
};
