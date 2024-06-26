import { App } from "@/components/App";
import { useBrpcServer } from "@killthebuddha/fig";
import { useEffect, useMemo } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useLogin } from "@killthebuddha/fig";
import { useStream } from "@killthebuddha/fig";

export const Owner = () => {
  const { wallet, create } = useWallet();

  if (wallet === undefined) {
    throw new Error("WHISPER :: Owner.tsx :: wallet === undefined");
  }

  const { login, isLoggedIn } = useLogin({ wallet });

  const { start, isStreaming } = useStream({ wallet });

  console.log(`WHISPER :: OWNER :: isStreaming ${isStreaming}`);
  console.log(
    `WHISPER :: OWNER :: isLoggedIn ${isLoggedIn} ${wallet?.address}`,
  );

  useEffect(() => {
    if (login === null) {
      return;
    }

    console.log("WHISPER :: Owner :: login() :: CALLED");
    login();
  }, [login]);

  useEffect(() => {
    if (start === null) {
      return;
    }

    if (!isLoggedIn) {
      return;
    }

    console.log("WHISPER :: Owner :: start() :: CALLED");
    start().then((response) => {
      console.log("WHISPER :: Owner :: start() :: response", response);
    });
  }, [start, isLoggedIn]);

  const { start } = useBrpcServer({ wallet });

  useEffect(() => {
    if (start === null) {
      return;
    }

    start();
  }, [start]);

  return <App>{null /* <Messages /> */}</App>;
};
