import { useMemo } from "react";
import { createRemote } from "../remote/createRemote.js";
import { Signer } from "../remote/Signer.js";
import { useRemote } from "./useRemote.js";
import { useClient } from "./useClient.js";

export const useStartGlobalMessageStream = ({
  wallet,
}: {
  wallet?: Signer;
}) => {
  const remote = useRemote({ wallet });
  const client = useClient({ wallet });

  return useMemo(() => {
    if (remote === null) {
      return null;
    }

    if (client === null) {
      return null;
    }

    if (client.client.code !== "success") {
      return null;
    }

    return remote.startGlobalMessageStream;
  }, [remote, client]);
};
