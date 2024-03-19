import { useSyncExternalStore, useCallback } from "react";
import { Store } from "./Store.js";
import { createSubscribe } from "./createSubscribe.js";
import { getClient } from "./getClient.js";
import { setClient } from "./setClient.js";
import { Wallet } from "@ethersproject/wallet";
import { Client } from "@xmtp/xmtp-js";

export const useClient = ({ store }: { store: Store }) => {
  const client = useSyncExternalStore(createSubscribe({ store }), () =>
    getClient({ store }),
  );

  const start = useCallback(
    ({ pk }: { pk: string }) => {
      if (client !== undefined) {
        return;
      }

      Client.create(new Wallet(pk), { env: "production" }).then((client) => {
        setClient({ store, client });
      });
    },
    [client],
  );

  return { client, start };
};
