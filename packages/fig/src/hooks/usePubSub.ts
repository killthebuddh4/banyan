import { useCallback, useEffect, useMemo } from "react";
import { Message } from "../remote/Message.js";
import { Signer } from "../remote/Signer.js";
import { useMessages } from "./useMessages.js";
import { useRemoteActions } from "./useRemoteActions.js";
import { useRemoteState } from "./useRemoteState.js";

// The point of this hook is to work with somewhat arbitrary
// groups of conversations. It multiplexes inbound conversations
// and then demultiplexes outbound conversations. It abstracts
// the XMTP conversation and messages into something like a
// topic or channel.

export const usePubSub = ({
  wallet,
  opts,
}: {
  wallet?: Signer;
  opts?: { filter?: (m: Message) => boolean };
}) => {
  const { messages, pushMessages } = useMessages();

  const messageFilter = useCallback(
    (message: Message) => {
      if (wallet === undefined) {
        return false;
      }

      if (opts?.filter === undefined) {
        return true;
      }

      return opts.filter(message);
    },
    [wallet, opts?.filter]
  );

  const messages = useMemo(() => {
    if (wallet === undefined) {
      return [];
    }

    return messageStore.messages[wallet.address] || [];
  }, [messageStore.messages, wallet?.address]);

  return { messages, send: sendMessage };
};
