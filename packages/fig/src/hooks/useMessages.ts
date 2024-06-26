import { create } from "zustand";
import { Message } from "../remote/Message.js";
import { uniqueMessages } from "../lib/uniqueMessages.js";

export const useMessages = create<{
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
