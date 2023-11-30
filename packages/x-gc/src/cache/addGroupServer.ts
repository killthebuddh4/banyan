import { GroupServer } from "./GroupServer.js";
import { Store } from "./Store.js";

export const addGroupServer = async ({
  store,
  groupServer,
}: {
  store: Store;
  groupServer: GroupServer;
}) => {
  store.groupServers.set(groupServer.client.address, groupServer);
};
