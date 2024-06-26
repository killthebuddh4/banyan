import { Message } from "../remote/Message.js";
import { Signer } from "../remote/Signer.js";
import { useMemo } from "react";
import { createBrpcClient } from "../lib/createBrpcClient.js";
import { useRemoteActions } from "./useRemoteActions.js";
import { useStream } from "./useStream.js";
import * as Brpc from "@killthebuddha/brpc/brpc.js";

export const useBrpcClient = <A extends Brpc.BrpcApi>(props: {
  api: A;
  address: string;
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
  const { sendMessage } = useRemoteActions({
    wallet: props.wallet,
  });

  const { listen } = useStream({ wallet: props.wallet });

  const prefix = (() => {
    if (props.options?.conversationIdPrefix) {
      return props.options.conversationIdPrefix;
    }

    return "banyan.sh/brpc";
  })();

  const wrappedListen = useMemo(() => {
    console.log("FIG :: useBrpcClient :: listen got a message");
    if (listen === null) {
      return null;
    }

    return (handler: (message: Message) => void) => {
      return listen((message) => {
        if (message.conversation.context === undefined) {
          console.log(
            "FIG :: useBrpcClient :: ignoring message without context"
          );
          return;
        }

        if (!message.conversation.context.conversationId.startsWith(prefix)) {
          console.log(
            "FIG :: useBrpcClient :: ignoring message with incorrect conversationId"
          );
          return;
        }

        console.log("FIG :: useBrpcClient :: handling message");
        handler(message);
      });
    };
  }, [listen, prefix]);

  return useMemo(() => {
    if (wrappedListen === null) {
      return null;
    }

    if (sendMessage === null) {
      return null;
    }

    if (props.wallet === undefined) {
      return null;
    }

    return createBrpcClient({
      api: props.api,
      conversation: {
        peerAddress: props.address,
        context: {
          conversationId: `${prefix}`,
          metadata: {},
        },
      },
      clientAddress: props.wallet.address,
      listen: wrappedListen,
      sendMessage,
      options: props.options,
    });
  }, [
    props.api,
    props.address,
    props.wallet?.address,
    wrappedListen,
    sendMessage,
    prefix,
    props.options,
  ]);
};
