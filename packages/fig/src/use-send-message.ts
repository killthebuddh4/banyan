import { useState } from "react";
import { useXmtp } from "./use-xmtp";
import * as Lib from "./lib";

export const useSendMessage = ({
  wallet,
  conversation,
}: {
  wallet?: { address: string };
  conversation?: Lib.Conversation;
}) => {
  const xmtp = useXmtp({ wallet });
  const [_state, setState] = useState<Lib.AsyncState<Lib.Message> | null>(null);

  if (xmtp === null) {
    return null;
  }

  if (typeof wallet !== "object") {
    return null;
  }

  if (typeof conversation !== "object") {
    return null;
  }

  const state: Lib.AsyncState<Lib.Message> = (() => {
    if (_state === null) {
      return { id: "idle" };
    }

    return _state;
  })();

  const send = async ({ content }: { content: string }): Promise<void> => {
    try {
      setState({ id: "pending" });

      const response = await xmtp.sendMessage({
        conversation,
        content,
      });
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
    send,
    sent: state.data,
    isIdle: state.id === "idle",
    isPending: state.id === "pending",
    isSuccess: state.id === "success",
    isError: state.id === "error",
    error: state.error,
  };
};
