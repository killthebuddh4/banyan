import { Signer } from "../remote/Signer.js";
import { useRemote } from "./useRemote.js";
import { useClient } from "./useClient.js";
import { useGlobalMessageStreamStore } from "./useGlobalMessageStreamStore.js";
import { useMemo } from "react";

export const useListenToGlobalMessageStream = ({
  wallet,
}: {
  wallet?: Signer;
}) => {
  const remote = useRemote({ wallet });
  const client = useClient({ wallet });
  const stream = useGlobalMessageStreamStore({ wallet });

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

    if (stream === null) {
      return null;
    }

    return remote.listenToGlobalMessageStream;
  }, [remote, client, stream]);
};
