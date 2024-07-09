import { useMemo, useEffect } from "react";
import { Signer } from "../remote/Signer.js";
import { useActions } from "./useActions.js";
import { Message } from "../remote/Message.js";
import { AsyncState } from "../remote/AsyncState.js";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

const useStreamStore = create<{
  stream: AsyncState<undefined> | null;
}>(() => ({
  stream: null,
}));

export const useStream = ({ wallet }: { wallet?: Signer; opts?: {} }) => {
  const {
    listenToGlobalMessageStream,
    ignoreGlobalMessageStream,
    startGlobalMessageStream,
    stopGlobalMessageStream,
    fetchState,
    subscribeToState,
    unsubscribeToState,
  } = useActions();

  const stream = useStreamStore((s) => s.stream);

  useEffect(() => {
    (async () => {
      if (wallet === undefined) {
        return;
      }

      const result = await fetchState(wallet);

      if (!result.ok) {
        return;
      }

      useStreamStore.setState({ stream: result.data.globalMessageStream });
    })();

    let unsub: (() => void) | undefined;

    (async () => {
      if (wallet === undefined) {
        return;
      }

      const result = await subscribeToState({
        wallet,
        onChange: (s) => {
          useStreamStore.setState({ stream: s.globalMessageStream });
        },
      });

      if (!result.ok) {
        return;
      }

      unsub = () => {
        if (wallet === undefined) {
          return;
        }

        return unsubscribeToState({
          wallet,
          subscriptionId: result.data.subscriptionId,
        });
      };
    })();

    return () => {
      unsub?.();
    };
  }, [wallet, fetchState, subscribeToState, unsubscribeToState]);

  const start = useMemo(() => {
    return async () => {
      if (wallet === undefined) {
        throw new Error("useStream :: wallet is undefined");
      }

      return startGlobalMessageStream(wallet);
    };
  }, [wallet, startGlobalMessageStream]);

  const stop = useMemo(() => {
    return async () => {
      if (wallet === undefined) {
        throw new Error("useStream :: wallet is undefined");
      }

      return stopGlobalMessageStream(wallet);
    };
  }, [wallet, stopGlobalMessageStream]);

  const subscribe = useMemo(() => {
    return (handler: (message: Message) => void) => {
      if (wallet === undefined) {
        throw new Error("useStream :: subscribe :: wallet is undefined");
      }

      return listenToGlobalMessageStream({
        wallet: wallet,
        id: uuidv4(),
        handler,
      });
    };
  }, [wallet, listenToGlobalMessageStream]);

  const unsubscribe = useMemo(() => {
    return (id: string) => {
      if (wallet === undefined) {
        throw new Error("useStream :: unsubscribe :: wallet is undefined");
      }

      ignoreGlobalMessageStream({ wallet: wallet, id });
    };
  }, [wallet, ignoreGlobalMessageStream]);

  return {
    start,
    stop,
    subscribe,
    unsubscribe,
    isReady: stream?.code === "idle",
    isPending: stream?.code === "pending",
    isSuccess: stream?.code === "success",
    isError: stream?.code === "error",
  };
};
