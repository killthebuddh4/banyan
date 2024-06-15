import { useMemo, useEffect, useState } from "react";
import * as Comlink from "comlink";
import { createWorker } from "../worker/createWorker.js";
import { AsyncState } from "../worker/AsyncState.js";
import { Signer } from "../worker/Signer.js";

export const useClient = ({ wallet }: { wallet?: Signer }) => {
  const worker = createWorker({ wallet });

  const [clientStore, setClientStore] = useState<AsyncState<undefined> | null>(
    null
  );

  useEffect(() => {
    (async () => {
      if (worker === null) {
        setClientStore(null);
      } else {
        setClientStore(await worker.getClient());
      }
    })();
  }, [worker]);

  useEffect(() => {
    if (worker === null) {
      return;
    } else {
      worker.subscribeToClientStore(
        Comlink.proxy({
          onChange: (client) => {
            setClientStore(client);
          },
        })
      );
    }
  }, [worker]);

  const start = useMemo(() => {
    if (worker === null) {
      return null;
    }

    if (wallet === undefined) {
      return null;
    }

    if (clientStore === null) {
      return null;
    }

    if (clientStore.code !== "idle" && clientStore.code !== "error") {
      return null;
    }

    return () => worker.startClient(Comlink.proxy(wallet));
  }, [worker, wallet, clientStore]);

  const stop = useMemo<(() => Promise<void>) | null>(() => {
    if (worker === null) {
      return null;
    }

    if (clientStore === null) {
      return null;
    }

    if (clientStore.code !== "success") {
      return null;
    }

    return worker.stopClient;
  }, [worker, clientStore]);

  if (worker === null) {
    return null;
  }

  if (clientStore === null) {
    return null;
  }

  if (typeof wallet !== "object") {
    return null;
  }

  console.log("USE CLIENT :: clientStore.code", clientStore.code);

  return {
    start,
    stop,
    code: clientStore.code,
    isInactive: clientStore.code === "inactive",
    isIdle: clientStore.code === "idle",
    isPending: clientStore.code === "pending",
    isFetching: clientStore.code === "fetching",
    isSuccess: clientStore.code === "success",
    isError: clientStore.code === "error",
    client: clientStore.data,
  };
};
