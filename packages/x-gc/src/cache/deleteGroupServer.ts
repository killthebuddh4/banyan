import { Store } from "./Store.js";

export const deleteGroupServer = ({
  store,
  address,
}: {
  store: Store;
  address: string;
}) => {
  store.groupServers.delete(address);
};
