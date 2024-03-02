import { useState, useEffect } from "react";
import * as Lib from "./lib";
import { useXmtp } from "./use-xmtp";
import * as Comlink from "comlink";

export const useConversationsStream = ({
  wallet,
}: {
  wallet?: { address: string };
}) => {
  const xmtp = useXmtp({ wallet });
  const [stream, setStream] = useState<Lib.AsyncState<undefined> | null>(null);

  useEffect(() => {
    (async () => {
      if (xmtp === null) {
        setStream(null);
      } else {
        setStream(await xmtp.getConversationsStream());
      }
    })();
  }, [xmtp]);

  useEffect(() => {
    if (xmtp === null) {
      return;
    } else {
      xmtp.subscribeToConversationsStreamStore(
        Comlink.proxy({
          onChange: (stream) => {
            setStream(stream);
          },
        })
      );
    }
  }, [xmtp]);

  if (stream === null) {
    return null;
  }

  if (xmtp === null) {
    return null;
  }

  if (typeof wallet !== "object") {
    return null;
  }

  return {
    start: xmtp.startConversationsStream,
    stop: xmtp.stopConversationsStream,
    listen: (handler: (c: Lib.Conversation) => void) =>
      xmtp.listenToConversationsStream(Comlink.proxy(handler)),
    isIdle: stream.id === "idle",
    isPending: stream.id === "pending",
    isSuccess: stream.id === "success",
    isError: stream.id === "error",
    error: stream.error,
  };
};
