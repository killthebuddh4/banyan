import { Subscriber } from "./Subscriber.js";

export type Store = Map<string, Map<string, Subscriber>>;
