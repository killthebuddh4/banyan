import { useEffect, useState } from "react";
import * as Lib from "./lib";
import * as Comlink from "comlink";
import { useXmtp } from "./use-xmtp";

export const useClient = ({ wallet }: { wallet?: Lib.Signer }) => {
  const xmtp = useXmtp({ wallet });
  const [client, setClient] = useState<Lib.AsyncState<undefined> | null>(null);

  useEffect(() => {
    (async () => {
      if (xmtp === null) {
        setClient(null);
      } else {
        setClient(await xmtp.getClient());
      }
    })();
  }, [xmtp]);

  useEffect(() => {
    if (xmtp === null) {
      return;
    } else {
      xmtp.subscribeToClientStore(
        Comlink.proxy({
          onChange: (client) => {
            setClient(client);
          },
        })
      );
    }
  }, [xmtp]);

  if (client === null) {
    return null;
  }

  if (xmtp === null) {
    return null;
  }

  if (typeof wallet !== "object") {
    return null;
  }

  return {
    start: () => xmtp.startClient(Comlink.proxy(wallet)),
    stop: () => xmtp.stopClient(),
    isIdle: client.id === "idle",
    isPending: client.id === "pending",
    isSuccess: client.id === "success",
    isError: client.id === "error",
    error: client.error,
  };
};
