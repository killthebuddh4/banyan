import { useMemo } from "react";
import { Signer } from "../remote/Signer.js";
import { useRemote } from "./useRemote.js";
import { useClientStore } from "./useClientStore.js";

export const useStartGlobalMessageStream = ({
  wallet,
}: {
  wallet?: Signer;
}) => {
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

    return remote.startGlobalMessageStream;
  }, [remote, client]);
};
