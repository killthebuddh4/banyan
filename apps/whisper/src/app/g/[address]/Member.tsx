import { App } from "@/components/App";
import { useBrpcClient } from "@killthebuddha/fig";
import { useEffect, useMemo } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useLogin } from "@killthebuddha/fig";
import { useStream } from "@killthebuddha/fig";
import { useGroupAddressParam } from "@/hooks/useGroupAddressParam";

export const Member = () => {
  const { wallet, create } = useWallet();
  const groupAddress = useGroupAddressParam();

  const brpcClient = useBrpcClient({
    wallet,
    address: groupAddress,
  });
  const { login, isLoggedIn } = useLogin({ wallet });

  const { start, isStreaming } = useStream({ wallet });

  console.log(`WHISPER :: MEMBER :: isStreaming ${isStreaming}`);
  console.log(
    `WHISPER :: MEMBER :: isLoggedIn ${isLoggedIn} ${wallet?.address}`,
  );

  useEffect(() => {
    if (login === null) {
      return;
    }

    console.log("WHISPER :: Member :: login() :: CALLED");
    login();
  }, [login]);

  useEffect(() => {
    if (start === null) {
      return;
    }

    if (!isLoggedIn) {
      return;
    }

    console.log("WHISPER :: Member :: start() :: CALLED");
    start().then((response) => {
      console.log("WHISPER :: Member :: start() :: response", response);
    });
  }, [start, isLoggedIn]);

  useEffect(() => {
    create();
  }, []);

  useEffect(() => {
    (async () => {
      if (brpcClient === null) {
        console.log("WHISPER :: Member :: brpcClient === null");
        return;
      }

      if (!isStreaming) {
        console.log("WHISPER :: Member :: isStreaming === false");
        return;
      }

      console.log("MEMBER :: await client.pub() being called");

      const result = await brpcClient.pub();

      console.log("MEMBER :: await client.pub()", result);

      // const result = await brpcClient.join(memoWallet.address);

      console.log("MEMBER :: await client.join(wallet.address)", result);
    })();
  }, [brpcClient, isStreaming]);

  return (
    <App>
      {null}
      {/* <Messages /> */}
    </App>
  );
};
