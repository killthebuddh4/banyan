import * as Comlink from "comlink";
import { useRemote } from "./useRemote.js";
import { Signer } from "../remote/Signer.js";
import { useClientStore } from "./useClientStore.js";
import { useMemo } from "react";

export const useStartClient = ({ wallet }: { wallet?: Signer }) => {
  const remote = useRemote({ wallet });
  const client = useClientStore({ wallet });

  return useMemo(() => {
    if (remote === null) {
      console.log("FIG :: useStartClient :: REMOTE IS NULL");
      return null;
    }

    if (client === null) {
      console.log("FIG :: useStartClient :: CLIENT IS NULL");
      return null;
    }

    if (client.code !== "idle" && client.code !== "error") {
      console.log(`FIG :: useStartClient :: CLIENT CODE IS ${client.code}`);
      return null;
    }

    if (wallet === undefined) {
      console.log("FIG :: useStartClient :: WALLET IS UNDEFINED");
      return null;
    }

    return () => remote.startClient(Comlink.proxy(wallet));
  }, [remote, client]);
};
