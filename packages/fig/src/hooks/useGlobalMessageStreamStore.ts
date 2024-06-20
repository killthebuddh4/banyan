import { useMemo, useEffect, useState } from "react";
import * as Comlink from "comlink";
import { createRemote } from "../remote/createRemote.js";
import { AsyncState } from "../remote/AsyncState.js";
import { Message } from "../remote/Message.js";
import { create } from "zustand";

export const useGlobalMessageStreamStore = ({
  wallet,
}: {
  wallet?: { address: string };
}) => {
  const worker = useMemo(() => {
    if (wallet === undefined) {
      return null;
    }

    return createRemote({ address: wallet.address });
  }, [wallet]);

  const [globalMessageStream, setGlobalMessageStream] =
    useState<AsyncState<undefined> | null>(null);

  useEffect(() => {
    (async () => {
      if (worker === null) {
        setGlobalMessageStream(null);
      } else {
        let subscribed = false;

        worker.subscribeToGlobalMessageStreamStore(
          Comlink.proxy({
            onChange: (stream) => {
              console.log(
                "useGlobalMessageStream :: subscribeToGlobalMessageStreamStore handler called",
                stream
              );
              subscribed = true;
              setGlobalMessageStream(stream);
            },
          })
        );

        const state = await worker.fetchGlobalMessageStream();

        if (!state.ok) {
          throw new Error("useGlobalMessageStream :: fetchGlobalMessageStream");
        }

        if (subscribed === false) {
          setGlobalMessageStream(state.data);
        }
      }
    })();
  }, [worker]);

  const start = useMemo(() => {
    if (worker === null) {
      return null;
    }

    if (globalMessageStream === null) {
      return null;
    }

    if (
      globalMessageStream.code !== "idle" &&
      globalMessageStream.code !== "error"
    ) {
      return null;
    }

    return () => worker.startGlobalMessageStream();
  }, [worker, globalMessageStream]);

  const listen = useMemo(() => {
    if (worker === null) {
      return null;
    }

    if (globalMessageStream === null) {
      return null;
    }

    if (globalMessageStream.code !== "success") {
      return null;
    }

    return (handler: (m: Message) => void) =>
      worker.listenToGlobalMessageStream(Comlink.proxy(handler));
  }, [worker, globalMessageStream]);

  if (worker === null) {
    return null;
  }

  if (globalMessageStream === null) {
    return null;
  }

  if (typeof wallet !== "object") {
    return null;
  }

  console.log(
    "useGlobalMessageStream :: globalMessageStream",
    globalMessageStream
  );

  return {
    start,
    listen,
    globalMessageStream,
  };
};
