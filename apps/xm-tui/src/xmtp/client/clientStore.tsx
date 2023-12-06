import { Store } from "./Store.js";

export const clientStore = {
  handlers: new Map<string, () => void>(),
  client: undefined,
} as Store;
