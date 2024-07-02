import { Message } from "./Message.js";
import { Topic } from "./Topic.js";

export type ClientOptions = {
  timeoutMs?: number;
  onRequestTimeout?: () => void;
  onReceivedInvalidJson?: (args: { message: Message }) => void;
  onReceivedInvalidResponse?: (args: { message: Message }) => void;
  onIdMismatch?: (args: { message: Message }) => void;
  onResponseHandlerError?: (args: { error: Error }) => void;
  onInputSerializationError?: () => void;
  onSendingRequest?: (args: { topic: Topic; content: string }) => void;
  onSentRequest?: (args: { message: Message }) => void;
  onSendRequestError?: (args: { error: Error }) => void;
};
