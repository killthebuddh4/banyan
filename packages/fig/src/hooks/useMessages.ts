import { useEffect, useMemo } from "react";
import { useGlobalMessageStream } from "./useGlobalMessageStream";
import { useSendMessage } from "./useSendMessage";
import { create } from "zustand";
import { Message } from "../remote/Message";
import { uniqueMessages } from "../lib/uniqueMessages";
import { Signer } from "../remote/Signer";

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

export const useMessages = ({ wallet }: { wallet?: Signer }) => {
  const globalMessageStream = useGlobalMessageStream({ wallet });
  const messageStore = useMessageStore();
  const sendMessage = useSendMessage({ wallet });

  useEffect(() => {
    (async () => {
      if (globalMessageStream === null) {
        return;
      }

      if (globalMessageStream.start === null) {
        return;
      }
      try {
        await globalMessageStream.start();
      } catch (e) {
        console.log("useMessages :: ERROR STARTING GLOBAL MESSAGE STREAM", e);
      }
    })();
  }, [globalMessageStream?.start]);

  useEffect(() => {
    if (wallet === undefined) {
      return;
    }

    if (globalMessageStream === null) {
      return;
    }

    if (globalMessageStream.listen === null) {
      return;
    }

    globalMessageStream.listen((message) => {
      messageStore.pushMessage(wallet.address, message);
    });
  }, [globalMessageStream?.listen]);

  if (wallet === undefined) {
    return { messages: [], send: null };
  }

  const messages = useMemo(() => {
    return messageStore.messages[wallet.address] || [];
  }, [messageStore.messages, wallet.address]);

  return { messages, send: sendMessage };
};
