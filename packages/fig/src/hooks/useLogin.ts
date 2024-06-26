import { useMemo, useEffect } from "react";
import { Signer } from "../remote/Signer.js";
import { useRemoteActions } from "./useRemoteActions.js";
import { useRemoteState } from "./useRemoteState.js";

export const useLogin = ({
  wallet,
  opts,
}: {
  wallet?: Signer;
  opts?: { autoLogin?: boolean; autoLogout?: boolean };
}) => {
  const state = useRemoteState({ wallet });
  const { startClient, stopClient } = useRemoteActions({ wallet });

  const autoLogin = useMemo(() => {
    if (opts?.autoLogin === false) {
      return false;
    }

    return true;
  }, [opts?.autoLogin]);

  const autoLogout = useMemo(() => {
    if (opts?.autoLogout === true) {
      return true;
    }

    return false;
  }, [opts?.autoLogout]);

  useEffect(() => {
    if (!autoLogin) {
      console.log("FIG :: useClient :: AUTO START IS FALSE");
      return;
    }

    if (startClient === null) {
      console.log("FIG :: useClient :: START CLIENT IS NULL");
      return;
    }

    if (stopClient === null) {
      console.log("FIG :: useClient :: STOP CLIENT IS NULL");
      return;
    }

    console.log("FIG :: useClient :: STARTING CLIENT");
    startClient();

    return () => {
      if (!autoLogout) {
        return;
      }

      stopClient();
    };
  }, [autoLogin, startClient, stopClient]);

  return {
    login: startClient,
    logout: stopClient,
    isLoggingIn: state.client.code === "pending",
    isLoggedIn: state.client.code === "success",
    isLoginError: state.client.code === "error",
  };
};
