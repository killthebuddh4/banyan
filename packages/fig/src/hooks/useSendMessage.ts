import { useMemo } from "react";
import { useRemote } from "./useRemote.js";
import { Signer } from "../remote/Signer.js";
import { useClientStore } from "./useClientStore.js";

export const useSendMessage = (props: { wallet?: Signer }) => {
  const wallet = useMemo(() => props.wallet, [props.wallet?.address]);
  const remote = useRemote({ wallet });
  const client = useClientStore({ wallet });

  useMemo(() => {
    console.log("FIG :: useSendMessage :: TEST client memo running");
  }, [client]);

  const sendMessage = useMemo(() => {
    if (remote === null) {
      return null;
    }

    if (client === null) {
      return null;
    }

    if (client.code !== "success") {
      return null;
    }

    return remote.sendMessage;
  }, [remote, client]);

  return sendMessage;
};
