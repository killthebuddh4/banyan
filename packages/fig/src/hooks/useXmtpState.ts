import { Signer } from "../remote/Signer.js";
import { create } from "zustand";
import { AsyncState } from "../remote/AsyncState.js";
import { useXmtpActions } from "./useXmtpActions.js";
import { useEffect } from "react";

const useRemoteStore = create<{
  client: AsyncState<undefined> | null;
  globalMessageStream: AsyncState<undefined> | null;
}>(() => ({
  client: null,
  globalMessageStream: null,
}));

export const useXmtpState = (props: { wallet?: Signer }) => {
  const state = useRemoteStore((s) => s);
  const actions = useXmtpActions();

  useEffect(() => {
    const wallet = props.wallet;

    if (wallet === undefined) {
      return;
    }

    const startFetching = async () => {
      const result = await actions.fetchState(wallet);

      if (!result.ok) {
        // TODO handle error;
        return;
      }

      useRemoteStore.setState(result.data);
    };

    let unsub: (() => void) | undefined;

    const startSubscribing = async () => {
      console.log("FIG :: useRemoteState :: CALLING subscribeToState");
      const result = await actions.subscribeToState({
        wallet,
        onChange: (s) => {
          console.log(
            "FIG :: useRemoteState :: subscribeToState :: onChange called, setting state",
            s
          );
          useRemoteStore.setState(s);
        },
      });

      if (!result.ok) {
        // TODO handle error;
        console.log(
          "FIG :: useRemoteState :: subscribeToState :: ERROR",
          result
        );
        return;
      }

      unsub = () => {
        return actions.unsubscribeToState({
          wallet,
          subscriptionId: result.data.subscriptionId,
        });
      };
    };

    startFetching();
    startSubscribing();

    return () => {
      if (unsub === undefined) {
        // do nothing;
      } else {
        unsub();
      }
    };
  }, [props.wallet, actions]);

  console.log("FIG :: useRemoteState :: RETURNING STATE", state);

  return state;
};
