import { Store } from "./Store.js";

export const routerStore: Store = {
  handlers: new Map<string, () => void>(),
  history: [],
};
