import { useMemo, useEffect, useState } from "react";
import * as Comlink from "comlink";
import { createRemote } from "../remote/createRemote.js";
import { AsyncState } from "../remote/AsyncState.js";
import { Signer } from "../remote/Signer.js";
import { useClientStore } from "./useClientStore.js";
import { useStartClient } from "./useStartClient.js";
import { useRemote } from "./useRemote.js";

export const useClient = ({
  wallet,
  opts,
}: {
  wallet?: Signer;
  opts?: { autoStart?: boolean };
}) => {
  const remote = useRemote({ wallet });
  const client = useClientStore({ wallet });
  const startClient = useStartClient({ wallet });

  const autoStart = useMemo(() => {
    if (opts?.autoStart === false) {
      return false;
    }

    return true;
  }, [opts?.autoStart]);

  useEffect(() => {
    if (remote === null) {
      console.log("FIG :: useClient :: REMOTE IS NULL");
      return;
    }

    if (!autoStart) {
      console.log("FIG :: useClient :: AUTO START IS FALSE");
      return;
    }

    if (startClient === null) {
      console.log("FIG :: useClient :: START CLIENT IS NULL");
      return;
    }

    if (wallet === undefined) {
      console.log("FIG :: useClient :: WALLET IS UNDEFINED");
      return;
    }

    console.log("FIG :: useClient :: STARTING CLIENT");
    startClient();
  }, [autoStart, startClient]);

  return {
    start: startClient,
    client,
  };
};
