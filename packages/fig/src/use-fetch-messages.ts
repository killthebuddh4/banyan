import { useState } from "react";
import { useXmtp } from "./use-xmtp";
import * as Lib from "./lib";

export const useFetchMessages = ({
  wallet,
}: {
  wallet?: { address: string };
}) => {
  const xmtp = useXmtp({ wallet });
  const [_state, setState] = useState<Lib.AsyncState<Lib.Message[]> | null>(
    null
  );

  if (xmtp === null) {
    return null;
  }

  if (typeof wallet !== "object") {
    return null;
  }

  const state: Lib.AsyncState<Lib.Message[]> = (() => {
    if (_state === null) {
      return { id: "idle" };
    }

    return _state;
  })();

  const fetch = async ({
    conversation,
  }: {
    conversation: Lib.Conversation;
  }): Promise<void> => {
    try {
      setState({ id: "pending" });

      const response = await xmtp.fetchMessages(conversation, {});

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
    messages: state.data || [],
    isIdle: state.id === "idle",
    isPending: state.id === "pending",
    isSuccess: state.id === "success",
    isError: state.id === "error",
    error: state.error,
  };
};
