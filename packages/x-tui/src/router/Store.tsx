import { Route } from "./Route.js";

export type Store = {
  handlers: Map<string, () => void>;
  history: Route[];
};
