import { Store } from "./Store.js";

export const getGroupServer = ({
  store,
  address,
}: {
  store: Store;
  address: string;
}) => {
  return store.groupServers.get(address);
};
