import * as Comlink from "comlink";
import { Signer } from "../remote/Signer.js";
import { useRemote } from "./useRemote.js";
import { useClientStore } from "./useClientStore.js";
import { useGlobalMessageStreamStore } from "./useGlobalMessageStreamStore.js";
import { useMemo } from "react";
import { AsyncHandler } from "../remote/AsyncHandler.js";
import { Message } from "../remote/Message.js";

export const useListenToGlobalMessageStream = ({
  wallet,
}: {
  wallet?: Signer;
}) => {
  const remote = useRemote({ wallet });
  const client = useClientStore({ wallet });
  const stream = useGlobalMessageStreamStore({ wallet });

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

    if (stream === null) {
      return null;
    }

    return (handler: (m: Message) => void) =>
      remote.listenToGlobalMessageStream(Comlink.proxy(handler));
  }, [remote, client, stream]);
};
