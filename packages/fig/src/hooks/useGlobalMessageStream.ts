import { useMemo, useEffect, useState } from "react";
import { createRemote } from "../remote/createRemote";
import { AsyncState } from "../remote/AsyncState";
import * as Comlink from "comlink";
import { Message } from "../remote/Message";

export const useGlobalMessageStream = ({
  wallet,
}: {
  wallet?: { address: string };
}) => {
  const worker = createRemote({ wallet });

  const [globalMessageStream, setGlobalMessageStream] =
    useState<AsyncState<undefined> | null>(null);

  useEffect(() => {
    (async () => {
      if (worker === null) {
        setGlobalMessageStream(null);
      } else {
        const state = await worker.fetchGlobalMessageStream();

        if (!state.ok) {
          // TODO;
        } else {
          setGlobalMessageStream(state.data);
        }
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
            setGlobalMessageStream(stream);
          },
        })
      );
    }
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

  return {
    start,
    listen,
    globalMessageStream,
  };
};
