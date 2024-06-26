import { useCallback, useMemo } from "react";
import { Signer } from "../remote/Signer.js";
import { useMessages } from "./useMessages.js";
import { useRemoteActions } from "./useRemoteActions.js";
import { Message } from "../remote/Message.js";

// The point of this hook is to work with somewhat arbitrary
// groups of conversations. It multiplexes inbound conversations
// and then demultiplexes outbound conversations. It abstracts
// the XMTP conversation and messages into something like a
// topic or channel.

// TODO
// You know what, a way better way to do this would be to use `brpc`,
// that would actually be super legit.

export const usePubSub = (props: {
  wallet?: Signer;
  topic: string;
  members: string[];
  opts?: {
    allowAutoSubscribe?: boolean;
  };
}) => {
  const { sendMessage } = useRemoteActions({ wallet: props.wallet });

  const allowAutoSubscribe = useMemo(() => {
    if (props.opts?.allowAutoSubscribe === true) {
      return true;
    }

    return false;
  }, [props.opts?.allowAutoSubscribe]);

  const filter = useCallback(
    (message: Message) => {
      if (!allowAutoSubscribe) {
        const sender = props.members.find((address) => {
          return address === message.senderAddress;
        });

        if (sender === undefined) {
          return false;
        }
      }

      if (message.conversation.context === undefined) {
        return false;
      }

      if (message.conversation.context.conversationId !== props.topic) {
        return false;
      }

      return true;
    },
    [props.topic, props.members, allowAutoSubscribe]
  );

  const { messages } = useMessages({ wallet: props.wallet, opts: { filter } });

  const members = useMemo(() => {
    if (!allowAutoSubscribe) {
      return props.members;
    }

    return Array.from(
      new Set([
        ...props.members,
        ...messages
          .map((m) => m.senderAddress)
          .filter((address) => address !== props.wallet?.address),
      ])
    );
  }, [props.members, messages, allowAutoSubscribe]);

  const publish = useMemo(() => {
    if (sendMessage === null) {
      return null;
    }

    return async ({ content }: { content: string }) => {
      return await Promise.all(
        members.map(async (address) => {
          return sendMessage({
            conversation: {
              peerAddress: address,
              context: { conversationId: props.topic },
            },
            content,
          });
        })
      );
    };
  }, [sendMessage, props.members, props.topic]);

  return { messages, publish };
};
