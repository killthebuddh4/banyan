import { useMemo, useEffect } from "react";
import { Signer } from "../remote/Signer.js";
import { useActions } from "./useActions.js";
import { AsyncState } from "../remote/AsyncState.js";
import { create } from "zustand";

const useClientStore = create<{
  client: AsyncState<undefined> | null;
}>(() => ({
  client: null,
}));

export const useLogin = ({
  wallet,
  opts,
}: {
  wallet?: Signer;
  opts?: { env?: "production" | "dev" };
}) => {
  const client = useClientStore((s) => s.client);

  const {
    startClient,
    stopClient,
    fetchState,
    subscribeToState,
    unsubscribeToState,
  } = useActions();

  useEffect(() => {
    if (wallet === undefined) {
      return;
    }

    (async () => {
      const result = await fetchState(wallet);

      if (!result.ok) {
        return;
      }

      useClientStore.setState({ client: result.data.client });
    })();

    let unsub: (() => void) | undefined;

    (async () => {
      const result = await subscribeToState({
        wallet,
        onChange: (s) => {
          useClientStore.setState({ client: s.client });
        },
      });

      if (!result.ok) {
        return;
      }

      unsub = () => {
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

  const login = useMemo(() => {
    return async () => {
      if (wallet === undefined) {
        throw new Error("useLogin :: wallet is undefined");
      }

      return startClient({ wallet, opts });
    };
  }, [wallet, startClient, opts]);

  const logout = useMemo(() => {
    return async () => {
      if (wallet === undefined) {
        throw new Error("useLogin :: wallet is undefined");
      }

      return stopClient(wallet);
    };
  }, [wallet, stopClient]);

  return {
    login,
    logout,
    isReady: client?.code === "idle",
    isPending: client?.code === "pending",
    isSuccess: client?.code === "success",
    isError: client?.code === "error",
  };
};
