import { useMemo, useEffect } from "react";
import { Signer } from "../remote/Signer.js";
import { useXmtpActions } from "./useXmtpActions.js";
import { useXmtpState } from "./useXmtpState.js";
import { Message } from "../remote/Message.js";
import { v4 as uuidv4 } from "uuid";

export const usePubSub = (props: {
  wallet?: Signer;
  opts?: {
    filter?: (message: Message) => boolean;
  };
}) => {
  const {
    listenToGlobalMessageStream,
    ignoreGlobalMessageStream,
    startGlobalMessageStream,
    stopGlobalMessageStream,
    sendMessage,
  } = useXmtpActions();

  const state = useXmtpState(props);

  const start = useMemo(() => {
    const wallet = props.wallet;

    return async () => {
      if (wallet === undefined) {
        throw new Error("usePubSub :: wallet is undefined");
      }

      return startGlobalMessageStream(wallet);
    };
  }, [props.wallet, startGlobalMessageStream]);

  const stop = useMemo(() => {
    const wallet = props.wallet;

    return async () => {
      if (wallet === undefined) {
        throw new Error("usePubSub :: wallet is undefined");
      }

      return stopGlobalMessageStream(wallet);
    };
  }, [props.wallet, stopGlobalMessageStream]);

  const subscribe = useMemo(() => {
    const wallet = props.wallet;

    return (handler: (message: Message) => void) => {
      if (wallet === undefined) {
        return null;
      }

      return listenToGlobalMessageStream({ wallet, id: uuidv4(), handler });
    };
  }, [props.wallet, listenToGlobalMessageStream]);

  const unsubscribe = useMemo(() => {
    const wallet = props.wallet;

    return (id: string) => {
      if (wallet === undefined) {
        return;
      }

      ignoreGlobalMessageStream({ wallet, id });
    };
  }, [props.wallet, ignoreGlobalMessageStream]);

  const publish = useMemo(() => {
    const wallet = props.wallet;

    return async (publishProps: {
      conversation: {
        peerAddress: string;
        context?: {
          conversationId: string;
          metadata: {};
        };
      };
      content: string;
    }) => {
      if (wallet === undefined) {
        throw new Error("usePubSub :: publish :: wallet is undefined");
      }

      return sendMessage({
        wallet,
        ...publishProps,
      });
    };
  }, [sendMessage, props.wallet]);

  return {
    start,
    stop,
    publish,
    subscribe,
    unsubscribe,
    isReady: state.globalMessageStream?.code === "idle",
    isPending: state.globalMessageStream?.code === "pending",
    isSuccess: state.globalMessageStream?.code === "success",
    isError: state.globalMessageStream?.code === "error",
  };
};
