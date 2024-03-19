import { Route } from "./Route.js";
import { Store } from "./Store.js";

export const setRoute = ({ store, route }: { store: Store; route: Route }) => {
  store.history.push(route);
  for (const handler of store.handlers.values()) {
    handler();
  }
};
