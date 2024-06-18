import { useMemo } from "react";
import { createRemote } from "../remote/createRemote";
import { useClient } from "./useClient";
import { Signer } from "../remote/Signer";

export const useSendMessage = ({ wallet }: { wallet?: Signer }) => {
  const remote = createRemote({ wallet });
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
