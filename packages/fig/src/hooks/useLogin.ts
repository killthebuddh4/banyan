import { useMemo } from "react";
import { Signer } from "../remote/Signer.js";
import { useXmtpActions } from "./useXmtpActions.js";
import { useXmtpState } from "./useXmtpState.js";

export const useLogin = ({
  wallet,
  opts,
}: {
  wallet?: Signer;
  opts?: { env?: "production" | "dev" };
}) => {
  const state = useXmtpState({ wallet });
  const { startClient, stopClient } = useXmtpActions();

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
    isReady: state.client?.code === "idle",
    isPending: state.client?.code === "pending",
    isSuccess: state.client?.code === "success",
    isError: state.client?.code === "error",
  };
};
