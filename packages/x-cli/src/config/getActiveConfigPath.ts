import { store } from "./store.js";

export const getActiveConfigPath = () => {
  return store.activeConfigPath;
};
