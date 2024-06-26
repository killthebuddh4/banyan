import { useMemo, useEffect } from "react";
import { Signer } from "../remote/Signer.js";
import { useRemoteActions } from "./useRemoteActions.js";
import { useRemoteState } from "./useRemoteState.js";

export const useStream = (props: {
  wallet?: Signer;
  opts?: { autoStart?: boolean; autoStop?: boolean };
}) => {
  const actions = useRemoteActions({ wallet: props.wallet });
  const { client, globalMessageStream } = useRemoteState({
    wallet: props.wallet,
  });

  const autoStart = useMemo(() => {
    if (props.opts?.autoStart === false) {
      return false;
    }

    return true;
  }, [props.opts?.autoStart]);

  const autoStop = useMemo(() => {
    if (props.opts?.autoStop === true) {
      return true;
    }

    return false;
  }, [props.opts?.autoStop]);

  const start = useMemo(() => {
    if (actions.startGlobalMessageStream === null) {
      return null;
    }

    if (client.code !== "success") {
      return null;
    }

    if (globalMessageStream.code !== "idle") {
      return null;
    }

    return actions.startGlobalMessageStream;
  }, [actions.startGlobalMessageStream, client.code, globalMessageStream.code]);

  const listen = useMemo(() => {
    if (actions.listenToGlobalMessageStream === null) {
      return null;
    }

    if (globalMessageStream.code !== "success") {
      return null;
    }

    return actions.listenToGlobalMessageStream;
  }, [actions.listenToGlobalMessageStream, globalMessageStream.code]);

  useEffect(() => {
    if (!autoStart) {
      console.log("FIG :: useStream :: AUTO START IS FALSE");
      return;
    }

    if (start === null) {
      console.log("FIG :: useStream :: START STREAM IS NULL");
      return;
    }

    start();

    return () => {
      if (!autoStop) {
        return;
      }

      // TODO stopGlobalMessageStream();
    };
  }, [autoStart, autoStop, start]);

  return {
    start,
    listen,
    isStreaming: globalMessageStream.code === "success",
    isStarting: globalMessageStream.code === "pending",
    isError: globalMessageStream.code === "error",
  };
};
