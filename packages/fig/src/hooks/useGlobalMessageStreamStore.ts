import { useMemo, useEffect, useState } from "react";
import * as Comlink from "comlink";
import { AsyncState } from "../remote/AsyncState.js";
import { create } from "zustand";
import { Signer } from "../remote/Signer.js";
import { useRemote } from "./useRemote.js";

export const store = create<{
  streams: Record<string, AsyncState<undefined>>;
}>(() => ({
  streams: {},
}));

export const useGlobalMessageStreamStore = ({
  wallet,
}: {
  wallet?: Signer;
}) => {
  const streams = store((state) => state.streams);

  const remote = useRemote({ wallet });

  useEffect(() => {
    if (remote === null) {
      return;
    }

    if (wallet === undefined) {
      return;
    }

    let gotChange = false;

    remote.subscribeToGlobalMessageStreamStore(
      Comlink.proxy({
        onChange: (stream) => {
          gotChange = true;

          store.setState((state) => {
            return {
              streams: {
                ...state.streams,
                [wallet.address]: stream,
              },
            };
          });
        },
      })
    );

    remote.fetchGlobalMessageStream().then((data) => {
      if (!data.ok) {
        console.log(
          "useGlobalMessageStreamStore :: fetchGlobalMessageStream :: ERROR",
          data.error
        );
        return;
      }

      if (gotChange) {
        return;
      }

      store.setState((state) => {
        return {
          streams: {
            ...state.streams,
            [wallet.address]: {
              ...data.data,
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

    const stream = streams[wallet.address];

    if (stream === undefined) {
      return null;
    }

    return stream;
  }, [streams, wallet]);
};