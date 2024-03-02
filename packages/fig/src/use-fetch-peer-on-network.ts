import { useState } from "react";
import { useXmtp } from "./use-xmtp";
import * as Lib from "./lib";

export const useFetchPeerOnNetwork = ({
  wallet,
  peerAddress,
}: {
  wallet?: { address: string };
  peerAddress?: string;
}) => {
  const xmtp = useXmtp({ wallet });
  const [_state, setState] = useState<Lib.AsyncState<boolean> | null>(null);

  if (xmtp === null) {
    return null;
  }

  if (typeof peerAddress !== "string") {
    return null;
  }

  const state: Lib.AsyncState<boolean> = (() => {
    if (_state === null) {
      return { id: "idle" };
    }

    return _state;
  })();

  const fetch = async (): Promise<void> => {
    try {
      setState({ id: "pending" });

      const response = await xmtp.fetchPeerOnNetwork({ peerAddress });

      if (response.status !== 200) {
        setState({ id: "error", error: undefined });
      } else {
        setState({ id: "success", data: response.data });
      }
    } catch {
      setState({ id: "error", error: undefined });
    }
  };

  return {
    fetch,
    isPeerOnNetwork: state.data,
    isIdle: state.id === "idle",
    isPending: state.id === "pending",
    isSuccess: state.id === "success",
    isError: state.id === "error",
    error: state.error,
  };
};
