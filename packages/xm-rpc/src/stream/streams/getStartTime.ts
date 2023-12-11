import { Store } from "./Store.js";

export const getStartTime = ({
  store,
  clientAddress,
}: {
  store: Store;
  clientAddress: string;
}) => {
  const stream = store.get(clientAddress);

  if (stream === undefined) {
    return null;
  }

  return stream.startedAt;
};
