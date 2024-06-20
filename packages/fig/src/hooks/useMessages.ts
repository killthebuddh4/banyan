import { useCallback, useEffect, useMemo } from "react";
import { useStartGlobalMessageStream } from "./useStartGlobalMessageStream.js";
import { useListenToGlobalMessageStream } from "./useListenToGlobalMessageStream.js";
import { useSendMessage } from "./useSendMessage.js";
import { create } from "zustand";
import { Message } from "../remote/Message.js";
import { uniqueMessages } from "../lib/uniqueMessages.js";
import { Signer } from "../remote/Signer.js";

const useMessageStore = create<{
  messages: Record<string, Message[]>;
  pushMessage: (address: string, message: Message) => void;
}>((set) => ({
  messages: {},
  pushMessage: (address, message) => {
    set((state) => {
      const prev = state.messages[address] || [];
      const unique = uniqueMessages({ messages: [...prev, message] });

      return {
        messages: {
          ...state.messages,
          [address]: unique,
        },
      };
    });
  },
}));

export const useMessages = ({
  wallet,
  opts,
}: {
  wallet?: Signer;
  opts?: { filter?: (m: Message) => boolean };
}) => {
  const messageStore = useMessageStore();
  const startGlobalMessageStream = useStartGlobalMessageStream({ wallet });
  const listenToGlobalMessageStream = useListenToGlobalMessageStream({
    wallet,
  });
  const sendMessage = useSendMessage({ wallet });

  useEffect(() => {
    (async () => {
      if (startGlobalMessageStream === null) {
        return;
      }

      try {
        await startGlobalMessageStream();
      } catch (e) {
        console.log("useMessages :: ERROR STARTING GLOBAL MESSAGE STREAM", e);
      }
    })();
  }, [startGlobalMessageStream]);

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

  useEffect(() => {
    if (listenToGlobalMessageStream === null) {
      return;
    }

    if (wallet === undefined) {
      return;
    }

    listenToGlobalMessageStream((message) => {
      if (!messageFilter(message)) {
        return;
      }

      messageStore.pushMessage(wallet.address, message);
    });
  }, [wallet, listenToGlobalMessageStream, messageFilter]);

  const messages = useMemo(() => {
    if (wallet === undefined) {
      return [];
    }

    return messageStore.messages[wallet.address] || [];
  }, [messageStore.messages, wallet?.address]);

  return { messages, send: sendMessage };
};
