import { Signer } from "../remote/Signer.js";
import { create } from "zustand";
import { AsyncState } from "../remote/AsyncState.js";
import { useRemoteActions } from "./useRemoteActions.js";
import { useEffect } from "react";

const useStore = create<{
  client: AsyncState<undefined>;
  globalMessageStream: AsyncState<undefined>;
}>(() => ({
  client: { code: "idle" },
  globalMessageStream: { code: "inactive" },
}));

export const useRemoteState = (props: { wallet?: Signer }) => {
  const state = useStore((s) => s);
  const { setState } = useStore;
  const { fetchState, subscribeToState, unsubscribeToState } = useRemoteActions(
    { wallet: props.wallet }
  );

  useEffect(() => {
    if (fetchState === null) {
      return;
    }

    if (subscribeToState === null) {
      return;
    }

    if (unsubscribeToState === null) {
      return;
    }

    const startFetching = async () => {
      const result = await fetchState();

      if (!result.ok) {
        console.log("FIG :: useRemoteState :: fetchState :: ERROR", result);
        return;
      }

      // TODO I think there is a race condition between
      // fetch and subscribe, but I'm not 100% sure.
      console.log(
        "FIG :: useRemoteState :: fetchState :: SUCCESS :: SETTING STATE",
        result.data
      );
      useStore.setState(result.data);
    };

    let unsub: (() => void) | undefined;

    const startSubscribing = async () => {
      console.log("FIG :: useRemoteState :: CALLING subscribeToState");
      const result = await subscribeToState({
        // TODO I think there is a race condition between
        // fetch and subscribe, but I'm not 100% sure.
        onChange: (s) => {
          console.log(
            "FIG :: useRemoteState :: subscribeToState :: onChange called, setting state",
            s
          );
          setState(s);
        },
      });

      if (!result.ok) {
        // TODO;
        console.log(
          "FIG :: useRemoteState :: subscribeToState :: ERROR",
          result
        );
        return;
      }

      unsub = () => {
        return unsubscribeToState({
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
  }, [fetchState, subscribeToState, unsubscribeToState]);

  console.log("FIG :: useRemoteState :: RETURNING STATE", state);

  return state;
};
