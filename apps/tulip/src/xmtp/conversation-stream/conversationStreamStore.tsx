import { Store } from "./Store.js";

export const conversationStreamStore = {
  handlers: new Map(),
  stream: null as Store["stream"],
} as Store;
