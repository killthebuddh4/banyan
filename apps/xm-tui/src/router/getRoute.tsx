import { Store } from "./Store.js";

export const getRoute = ({ store }: { store: Store }) => {
  const route = store.history[store.history.length - 1];
  if (route === undefined) {
    return null;
  }
  return route;
};
