import { Message } from "../remote/Message.js";
import { Signer } from "../remote/Signer.js";
import { useEffect, useMemo, useState } from "react";
import { useRemoteActions } from "./useRemoteActions.js";
import { useStream } from "./useStream.js";
import * as Brpc from "@killthebuddha/brpc/brpc.js";
import { bindClient } from "@killthebuddha/brpc/bindClient.js";

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

  useEffect(() => {
    if (props.wallet === undefined) {
      return;
    }
    
    if (listen === null) {
      return;
    }

    if (sendMessage === null) {
      return;
    }

    bindClient({
      api: props.api,
      xmtp: {
        address: props.wallet.address,
        subscribe: listen,
        publish: async ({ conversation, content }) => {
          const result = await sendMessage({
            conversation,
            content,
          });

          if (!result.ok) {
            throw new Error(result.error);
          }

          return result.data;
        },
      },
      conversation: {
        peerAddress: props.server.address,
        context: {
          conversationId: "banyan.sh/brpc",
          metadata: {},
        },
      },
      options: props.options,
    });
  }





