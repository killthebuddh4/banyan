import { Message } from "../remote/Message.js";

export const uniqueMessages = ({ messages }: { messages: Message[] }) => {
  return messages.reduce((acc, message) => {
    if (acc.find((m) => m.id === message.id) === undefined) {
      acc.push(message);
    }

    return acc;
  }, [] as Message[]);
};
