import { Store } from "./Store.js";

export const conversationStore = {
  handlers: new Map(),
  index: new Map(),
  conversations: [],
} as Store;
