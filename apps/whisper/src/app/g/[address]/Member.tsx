import { App } from "@/components/App";
import { Messages } from "@/components/Messages";
import { useGroupMember } from "@/hooks/useGroupMember";
import { useEffect, useMemo } from "react";
import { useWallet } from "@/hooks/useWallet";

export const Member = () => {
  const { wallet, create } = useWallet();

  const memoWallet = useMemo(() => wallet, [wallet?.address]);

  const brpcClient = useGroupMember();

  useEffect(() => {
    create();
  }, []);

  useMemo(() => {
    console.log("WHISPER :: Member :: TEST brpcClient memo running");
  }, [brpcClient]);

  useEffect(() => {
    (async () => {
      if (brpcClient === null) {
        console.log("WHISPER :: Member :: brpcClient === null");
        return;
      }

      if (memoWallet === undefined) {
        console.log("WHISPER :: Member :: wallet === undefined");
        return;
      }

      console.log(
        "WHISPER :: Member :: await client.join(wallet.address) :: CALLED",
      );

      const result = await brpcClient.join(memoWallet.address);

      console.log("MEMBER :: await client.join(wallet.address)", result);
    })();
  }, [brpcClient, memoWallet]);

  return (
    <App>
      <Messages />
    </App>
  );
};
