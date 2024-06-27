import { create } from "zustand";
import { Message } from "../remote/Message.js";
import { uniqueMessages } from "../lib/uniqueMessages.js";
import { useEffect } from "react";
import { Signer } from "../remote/Signer.js";
import { usePubSub } from "./usePubSub.js";

const useInboxStore = create<{
  messages: Record<string, Message[] | undefined>;
  pushMessage: (message: Message) => void;
}>((set) => ({
  messages: {},
  pushMessage: (msg) => {
    set((state) => {
      const prev = state.messages[msg.conversation.peerAddress] || [];
      const unique = uniqueMessages({ messages: [...prev, msg] });

      return {
        messages: {
          ...state.messages,
          [msg.conversation.peerAddress]: unique,
        },
      };
    });
  },
}));

export const useInbox = (props: {
  // TODO: The store should be parameterized by wallet address.
  wallet?: Signer;
  opts?: { filter: (message: Message) => boolean };
}) => {
  const { subscribe } = usePubSub({ wallet: props.wallet });
  const inbox = useInboxStore((state) => state.messages);
  const pushMessage = useInboxStore((state) => state.pushMessage);

  useEffect(() => {
    if (subscribe === null) {
      return;
    }

    subscribe(pushMessage);
  }, [subscribe, pushMessage]);

  return { inbox };
};
