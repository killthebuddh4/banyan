import { Store } from "./Store.js";
import crypto from "crypto";

export const createSubscribe = ({ store }: { store: Store }) => {
  return (handler: () => void) => {
    const id = crypto.randomUUID();
    store.handlers.set(id, handler);
    return () => store.handlers.delete(id);
  };
};
