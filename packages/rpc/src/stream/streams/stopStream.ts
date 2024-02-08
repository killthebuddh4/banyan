import { Store } from "./Store.js";

export const stopStream = ({
  store,
  clientAddress,
}: {
  store: Store;
  clientAddress: string;
}) => {
  const stream = store.get(clientAddress);

  if (!stream) {
    return;
  }

  const str = stream.stream;

  store.delete(clientAddress);

  return str.return();
};
