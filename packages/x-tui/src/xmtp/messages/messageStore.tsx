import { Store } from "./Store.js";

export const messageStore = {
  handlers: new Map(),
  index: new Map(),
  messages: new Map(),
} as Store;
