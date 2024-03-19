import { Client } from "@xmtp/xmtp-js";
import { Store } from "./Store.js";

export const setClient = ({
  store,
  client,
}: {
  store: Store;
  client: Client;
}) => {
  if (store.client !== undefined) {
    if (store.client.address !== client.address) {
      throw new Error("Cannot change client address");
    } else {
      return;
    }
  }

  store.client = client;

  for (const handler of store.handlers.values()) {
    handler();
  }
};
