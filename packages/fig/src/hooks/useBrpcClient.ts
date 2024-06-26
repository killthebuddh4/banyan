import { Message } from "../remote/Message.js";
import { Signer } from "../remote/Signer.js";
import { useMemo } from "react";
import { createBrpcClient } from "../lib/createBrpcClient.js";
import { useRemoteActions } from "./useRemoteActions.js";
import { useStream } from "./useStream.js";
import * as Brpc from "@killthebuddha/brpc/brpc.js";

export const useBrpcClient = <A extends Brpc.BrpcApi>(props: {
  api: A;
  server: {
    address: string;
  };
  wallet?: Signer;
  options?: {
    timeoutMs?: number;
    conversationIdPrefix?: string;
    onSelfSentMessage?: ({ message }: { message: Message }) => void;
    onReceivedInvalidJson?: ({ message }: { message: Message }) => void;
    onReceivedInvalidResponse?: ({ message }: { message: Message }) => void;
    onNoSubscription?: ({ message }: { message: Message }) => void;
    onCreateXmtpError?: () => void;
    onCreateStreamError?: () => void;
    onCreateStreamSuccess?: () => void;
    onCreateConversationError?: () => void;
    onHandlerError?: () => void;
    onSendFailed?: () => void;
  };
}) => {
  const walletAddress = props.wallet?.address;

  const { sendMessage } = useRemoteActions({
    wallet: props.wallet,
  });

  const { listen } = useStream({ wallet: props.wallet });

  const start = useMemo(() => {
    if (listen === null) {
      return null;
    }

    if (sendMessage === null) {
      return null;
    }

    if (walletAddress === undefined) {
      return null;
    }

    const prefix = (() => {
      if (props.options?.conversationIdPrefix) {
        return props.options.conversationIdPrefix;
      }

      return "banyan.sh/brpc";
    })();

    return () =>
      createBrpcClient({
        api: props.api,
        topic: {
          peerAddress: props.server.address,
          context: {
            conversationId: `${prefix}`,
            metadata: {},
          },
        },
        clientAddress: walletAddress,
        subscribe: listen,
        publish: sendMessage,
        options: props.options,
      });
  }, [
    props.api,
    props.server.address,
    walletAddress,
    listen,
    sendMessage,
    props.options,
  ]);

  return { start };
};
