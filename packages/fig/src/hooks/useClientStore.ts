import { useMemo, useEffect, useState } from "react";
import * as Comlink from "comlink";
import { AsyncState } from "../remote/AsyncState.js";
import { Signer } from "../remote/Signer.js";
import { useRemote } from "./useRemote.js";
import { create } from "zustand";

const store = create<{
  clients: Record<string, AsyncState<undefined> | undefined>;
}>(() => ({
  clients: {},
}));

export const useClientStore = (props: { wallet?: Signer }) => {
  const wallet = useMemo(() => props.wallet, [props.wallet?.address]);
  const clients = store((state) => state.clients);

  useMemo(() => {
    console.log("FIG :: useClientStore :: clients memo running");
  }, [clients]);

  useMemo(() => {
    console.log("FIG :: useClientStore :: wallet memo running");
  }, [wallet]);

  const remote = useRemote({ wallet });

  useEffect(() => {
    if (remote === null) {
      return;
    }

    if (wallet === undefined) {
      return;
    }

    remote.subscribeToClientStore(
      Comlink.proxy({
        onChange: (client) => {
          console.log("FIG :: useClientStore :: got remote change");
          gotChange = true;

          store.setState((state) => {
            return {
              clients: {
                ...state.clients,
                [wallet.address]: client,
              },
            };
          });
        },
      })
    );

    let gotChange = false;

    remote.fetchClient().then((data) => {
      if (!data.ok) {
        console.log("useClientStore :: fetchClient :: ERROR", data.error);
        return;
      }

      if (gotChange) {
        return;
      }

      store.setState((state) => {
        return {
          clients: {
            ...state.clients,
            [wallet.address]: {
              ...data.data,
              data: undefined,
            },
          },
        };
      });
    });
  }, [remote, wallet]);

  return useMemo(() => {
    if (wallet === undefined) {
      return null;
    }

    const client = clients[wallet.address];

    if (client === undefined) {
      return null;
    }

    return client;
  }, [wallet, clients]);
};
