import { useEffect, useState, useCallback } from "react";
import { createWorker } from "../worker/createWorker.js";
import { AsyncState } from "../worker/AsyncState.js";
import * as Comlink from "comlink";
import { Message } from "../worker/Message.js";

export const useWorkerGlobalMessageStreamStore = ({
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
    start: worker.startGlobalMessageStream,
    listen: (handler: (m: Message) => void) =>
      worker.listenToGlobalMessagesStream(Comlink.proxy(handler)),
    stream: globalMessageStreamStore,
  };
};
