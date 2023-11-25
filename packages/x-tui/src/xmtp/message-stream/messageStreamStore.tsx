import { Store } from "./Store.js";

export const messageStreamStore = {
  handlers: new Map(),
  streams: new Map(),
} as Store;
