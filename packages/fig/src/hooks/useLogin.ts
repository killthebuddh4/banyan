import { useMemo, useEffect } from "react";
import { Signer } from "../remote/Signer.js";
import { useRemoteActions } from "./useRemoteActions.js";
import { useRemoteState } from "./useRemoteState.js";

export const useLogin = ({
  wallet,
  opts,
}: {
  wallet?: Signer;
  opts?: {
    env: "production" | "dev";
    autoLogin?: boolean;
    autoLogout?: boolean;
  };
}) => {
  const state = useRemoteState({ wallet });
  const { startClient, stopClient } = useRemoteActions({ wallet });

  const autoLogin = useMemo(() => {
    if (opts?.autoLogin === true) {
      return true;
    }

    return false;
  }, [opts?.autoLogin]);

  const autoLogout = useMemo(() => {
    if (opts?.autoLogout === true) {
      return true;
    }

    return false;
  }, [opts?.autoLogout]);

  useEffect(() => {
    if (!autoLogin) {
      console.log("FIG :: useLogin :: AUTO START IS FALSE");
      return;
    }

    if (startClient === null) {
      console.log("FIG :: useLogin :: START CLIENT IS NULL");
      return;
    }

    if (stopClient === null) {
      console.log("FIG :: useLogin :: STOP CLIENT IS NULL");
      return;
    }

    if (state.client.code !== "idle") {
      console.log("FIG :: useLogin :: CLIENT NOT READY TO START");
      return;
    }

    startClient({ env: opts?.env })
      .then((response) => {
        console.log("FIG :: useLogin :: START CLIENT RESPONSE", response);
      })
      .catch((error) => {
        console.error("FIG :: useLogin :: START CLIENT ERROR", error);
      });

    return () => {
      if (!autoLogout) {
        return;
      }

      stopClient();
    };
  }, [autoLogin, startClient, stopClient, state.client.code, autoLogout]);

  console.log(`FIG :: useLogin :: state.client.code: ${state.client.code}`);

  return {
    login: startClient,
    logout: stopClient,
    isLoggingIn: state.client.code === "pending",
    isLoggedIn: state.client.code === "success",
    isLoginError: state.client.code === "error",
  };
};
