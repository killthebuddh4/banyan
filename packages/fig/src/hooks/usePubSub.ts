import { useMemo, useEffect } from "react";
import { Signer } from "../remote/Signer.js";
import { useRemoteActions } from "./useRemoteActions.js";
import { useRemoteState } from "./useRemoteState.js";
import { ignoreGlobalMessageStream } from "../remote/actions/ignoreGlobalMessageStream.js";
import { Message } from "../remote/Message.js";

export const usePubSub = (props: {
  wallet?: Signer;
  opts?: { autoStart?: boolean; autoStop?: boolean };
}) => {
  const {
    listenToGlobalMessageStream,
    startGlobalMessageStream,
    stopGlobalMessageStream,
    sendMessage,
  } = useRemoteActions({ wallet: props.wallet });

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
    if (startGlobalMessageStream === null) {
      return null;
    }

    if (client.code !== "success") {
      return null;
    }

    if (globalMessageStream.code !== "idle") {
      return null;
    }

    return startGlobalMessageStream;
  }, [startGlobalMessageStream, client.code, globalMessageStream.code]);

  const stop = useMemo(() => {
    if (stopGlobalMessageStream === null) {
      return null;
    }

    if (globalMessageStream.code !== "success") {
      return null;
    }

    return stopGlobalMessageStream;
  }, []);

  const subscribe = useMemo(() => {
    if (listenToGlobalMessageStream === null) {
      return null;
    }

    if (ignoreGlobalMessageStream === null) {
      return null;
    }

    if (globalMessageStream.code !== "success") {
      return null;
    }

    return async (handler: (message: Message) => void) => {
      const result = await listenToGlobalMessageStream(handler);

      if (result.code !== "SUCCESS") {
        throw new Error("Failed to listen to global message stream");
      }

      return () => {
        ignoreGlobalMessageStream(result.data.listenerId);
      };
    };
  }, [
    listenToGlobalMessageStream,
    ignoreGlobalMessageStream,
    globalMessageStream.code,
  ]);

  const publish = useMemo(() => {
    if (sendMessage === null) {
      return null;
    }

    if (client.code !== "success") {
      return null;
    }

    return async (props: {
      conversation: {
        peerAddress: string;
        context?: {
          conversationId: string;
          metadata: {};
        };
      };
      content: string;
    }) => {
      return sendMessage(props);
    };
  }, [sendMessage, client.code]);

  useEffect(() => {
    (() => {
      if (!autoStart) {
        console.log("FIG :: useStream :: AUTO START IS FALSE");
        return;
      }

      if (start === null) {
        console.log("FIG :: useStream :: START STREAM IS NULL");
        return;
      }

      start();
    })();

    return () => {
      if (!autoStop) {
        return;
      }

      if (stop === null) {
        return;
      }

      stop();
    };
  }, [autoStart, autoStop, start]);

  return {
    start,
    stop,
    publish,
    subscribe,
    isStreaming: globalMessageStream.code === "success",
    isStarting: globalMessageStream.code === "pending",
    isError: globalMessageStream.code === "error",
  };
};
