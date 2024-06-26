import { Signer } from "../remote/Signer.js";
import { Message } from "../remote/Message.js";
import { useMemo } from "react";
import { useRemoteActions } from "./useRemoteActions.js";
import * as Brpc from "@killthebuddha/brpc/brpc.js";
import { useStream } from "./useStream.js";
import { createBrpcServer } from "../lib/createBrpcServer.js";

export const useBrpcServer = <A extends Brpc.BrpcApi>(props: {
  api: A;
  wallet?: Signer;
  options?: {
    conversationIdPrefix?: string;
    onMessage?: ({ message }: { message: Message }) => void;
    onSelfSentMessage?: ({ message }: { message: Message }) => void;
    onReceivedInvalidJson?: ({ message }: { message: Message }) => void;
    onReceivedInvalidRequest?: ({ message }: { message: Message }) => void;
    onHandlerError?: () => void;
    onUnknownProcedure?: () => void;
    onAuthError?: () => void;
    onUnauthorized?: () => void;
    onInputTypeMismatch?: () => void;
    onSerializationError?: () => void;
    onHandlingMessage?: () => void;
    onResponseSent?: () => void;
    onSendFailed?: () => void;
  };
}) => {
  const { listen } = useStream({ wallet: props.wallet });
  const { sendMessage } = useRemoteActions({ wallet: props.wallet });

  const start = useMemo(() => {
    if (listen === null) {
      return null;
    }

    if (sendMessage === null) {
      return null;
    }

    const wallet = props.wallet;

    if (wallet === undefined) {
      return null;
    }

    return () =>
      createBrpcServer({
        api: props.api,
        address: wallet.address,
        listen,
        sendMessage,
        options: props.options,
      });
  }, [props.api, props.wallet?.address, listen, sendMessage, props.options]);

  return { start };
};
