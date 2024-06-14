import { useMemo, useEffect, useState, useCallback } from "react";
import * as Comlink from "comlink";
import { createWorker } from "../worker/createWorker.js";
import { AsyncState } from "../worker/AsyncState.js";
import { Signer } from "../worker/Signer.js";

export const useWorkerClientStore = ({ wallet }: { wallet?: Signer }) => {
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

  if (worker === null) {
    return null;
  }

  if (clientStore === null) {
    return null;
  }

  if (typeof wallet !== "object") {
    return null;
  }

  return {
    start: () => worker.startClient(Comlink.proxy(wallet)),
    stop: worker.stopClient,
    clientStore,
  };
};
