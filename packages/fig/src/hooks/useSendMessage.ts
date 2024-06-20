import { useMemo } from "react";
import { useRemote } from "./useRemote.js";
import { Signer } from "../remote/Signer.js";
import { useClientStore } from "./useClientStore.js";

export const useSendMessage = ({ wallet }: { wallet?: Signer }) => {
  const remote = useRemote({ wallet });
  const client = useClientStore({ wallet });

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
