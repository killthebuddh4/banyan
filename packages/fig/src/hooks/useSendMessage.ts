import { useMemo } from "react";
import { useRemote } from "./useRemote.js";
import { Signer } from "../remote/Signer.js";
import { useClient } from "./useClient.js";

export const useSendMessage = ({ wallet }: { wallet?: Signer }) => {
  const remote = useRemote({ wallet });
  const client = useClient({ wallet });

  const sendMessage = useMemo(() => {
    if (remote === null) {
      return null;
    }

    if (client === null) {
      return null;
    }

    if (client.client.code !== "success") {
      return null;
    }

    return remote.sendMessage;
  }, [remote, client]);

  return sendMessage;
};
