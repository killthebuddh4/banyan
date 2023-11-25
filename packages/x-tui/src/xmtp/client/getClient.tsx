import { Store } from "./Store.js";

export const getClient = ({ store }: { store: Store }) => {
  return store.client;
};
