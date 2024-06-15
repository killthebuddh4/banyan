import { useMemo, useEffect, useState } from "react";
import { createWorker } from "../worker/createWorker.js";
import { AsyncState } from "../worker/AsyncState.js";
import * as Comlink from "comlink";
import { Message } from "../worker/Message.js";

export const useGlobalMessageStream = ({
  wallet,
}: {
  wallet?: { address: string };
}) => {
  const worker = createWorker({ wallet });

  const [globalMessageStreamStore, setGlobalMessageStreamStore] =
    useState<AsyncState<undefined> | null>(null);

  useEffect(() => {
    (async () => {
      if (worker === null) {
        setGlobalMessageStreamStore(null);
      } else {
        setGlobalMessageStreamStore(await worker.getGlobalMessageStream());
      }
    })();
  }, [worker]);

  useEffect(() => {
    if (worker === null) {
      return;
    } else {
      worker.subscribeToGlobalMessageStreamStore(
        Comlink.proxy({
          onChange: (stream) => {
            setGlobalMessageStreamStore(stream);
          },
        })
      );
    }
  }, [worker]);

  const start = useMemo(() => {
    if (worker === null) {
      return null;
    }

    if (globalMessageStreamStore === null) {
      return null;
    }

    if (
      globalMessageStreamStore.code !== "idle" &&
      globalMessageStreamStore.code !== "error"
    ) {
      return null;
    }

    return () => worker.startGlobalMessageStream;
  }, [worker, globalMessageStreamStore]);

  const listen = useMemo(() => {
    if (worker === null) {
      return null;
    }

    if (globalMessageStreamStore === null) {
      return null;
    }

    if (globalMessageStreamStore.code !== "success") {
      return null;
    }

    return (handler: (m: Message) => void) =>
      worker.listenToGlobalMessagesStream(Comlink.proxy(handler));
  }, [worker, globalMessageStreamStore]);

  if (worker === null) {
    return null;
  }

  if (globalMessageStreamStore === null) {
    return null;
  }

  if (typeof wallet !== "object") {
    return null;
  }

  return {
    start,
    listen,
    isInactive: globalMessageStreamStore.code === "inactive",
    isIdle: globalMessageStreamStore.code === "idle",
    isPending: globalMessageStreamStore.code === "pending",
    isFetching: globalMessageStreamStore.code === "fetching",
    isSuccess: globalMessageStreamStore.code === "success",
    isError: globalMessageStreamStore.code === "error",
    stream: globalMessageStreamStore.data,
  };
};
