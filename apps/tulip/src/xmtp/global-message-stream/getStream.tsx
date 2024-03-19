import { Store } from "./Store.js";

export const getStream = ({ store }: { store: Store }) => {
  return store.stream;
};
