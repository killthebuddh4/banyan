import { useMemo, useEffect, useState } from "react";
import * as Comlink from "comlink";
import { createRemote } from "../remote/createRemote.js";
import { AsyncState } from "../remote/AsyncState.js";
import { Signer } from "../remote/Signer.js";

export const useClient = ({
  wallet,
  opts,
}: {
  wallet?: Signer;
  opts?: { autoStart?: boolean };
}) => {
  const worker = createRemote({ wallet });

  const [client, setClient] = useState<AsyncState<undefined> | null>(null);

  useEffect(() => {
    (async () => {
      if (worker === null) {
        setClient(null);
      } else {
        const state = await worker.fetchClient();

        if (!state.ok) {
          // TODO;
        } else {
          setClient(state.data);
        }
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
            setClient(client);
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

    if (client === null) {
      return null;
    }

    if (client.code !== "idle" && client.code !== "error") {
      return null;
    }

    return () => worker.startClient(Comlink.proxy(wallet));
  }, [worker, wallet, client]);

  const autoStart = useMemo(() => {
    if (opts?.autoStart === false) {
      return false;
    }

    return true;
  }, [opts?.autoStart]);

  useEffect(() => {
    if (!autoStart) {
      return;
    }

    if (start === null) {
      return;
    }

    start();
  }, [autoStart, start]);

  const stop = useMemo(() => {
    if (worker === null) {
      return null;
    }

    if (client === null) {
      return null;
    }

    if (client.code !== "success") {
      return null;
    }

    return worker.stopClient;
  }, [worker, client]);

  if (worker === null) {
    return null;
  }

  if (client === null) {
    return null;
  }

  if (typeof wallet !== "object") {
    return null;
  }

  console.log("USE CLIENT :: client.code", client.code);

  return {
    start,
    stop,
    client,
  };
};
