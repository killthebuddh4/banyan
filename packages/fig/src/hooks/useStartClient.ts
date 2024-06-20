import { useRemote } from "./useRemote.js";
import { Signer } from "../remote/Signer.js";
import { useClientStore } from "./useClientStore.js";
import { useMemo } from "react";

export const useStartClient = ({ wallet }: { wallet?: Signer }) => {
  const remote = useRemote({ wallet });
  const client = useClientStore({ wallet });

  return useMemo(() => {
    if (remote === null) {
      return null;
    }

    if (client === null) {
      return null;
    }

    if (client.code !== "success") {
      return null;
    }

    return remote.startClient;
  }, [remote, client]);
};
