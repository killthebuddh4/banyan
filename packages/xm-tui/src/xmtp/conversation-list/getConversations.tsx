import { Store } from "./Store.js";

export const getConversations = ({ store }: { store: Store }) => {
  return store.conversations;
};
