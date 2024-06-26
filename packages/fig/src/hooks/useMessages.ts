import { create } from "zustand";
import { Message } from "../remote/Message.js";
import { uniqueMessages } from "../lib/uniqueMessages.js";
import { useMemo } from "react";
import { Signer } from "../remote/Signer.js";

const useMessagesStore = create<{
  messages: Record<string, Message[]>;
  pushMessage: (args: { address: string; message: Message }) => void;
}>((set) => ({
  messages: {},
  pushMessage: (args) => {
    set((state) => {
      const prev = state.messages[args.address] || [];
      const unique = uniqueMessages({ messages: [...prev, args.message] });

      return {
        messages: {
          ...state.messages,
          [args.address]: unique,
        },
      };
    });
  },
}));

export const useMessages = (props: {
  // TODO: The store should be parameterized by wallet address.
  wallet?: Signer;
  opts?: { filter: (message: Message) => boolean };
}) => {
  const filter = useMemo(() => {
    if (props.opts?.filter === undefined) {
      return () => true;
    }

    return props.opts.filter;
  }, [props.opts?.filter]);

  const messages = useMessagesStore((state) =>
    Object.values(state.messages).flat().filter(filter)
  );
  const pushMessages = useMessagesStore((state) => state.pushMessage);

  return { messages, pushMessages };
};
