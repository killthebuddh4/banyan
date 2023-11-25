import { Store } from "./Store.js";

export const setStream = ({
  store,
  stream,
}: {
  store: Store;
  stream: NonNullable<Store["stream"]>;
}) => {
  if (store.stream !== null) {
    return;
  }

  store.stream = stream;

  for (const handler of store.handlers.values()) {
    handler();
  }
};
