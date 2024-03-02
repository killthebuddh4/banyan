import { useState, useEffect } from "react";
import * as Comlink from "comlink";
import * as Lib from "./lib";
import { useXmtp } from "./use-xmtp";

export const useConversationStream = ({
  wallet,
  conversation,
}: {
  wallet?: {
    address: string;
  };
  conversation?: {
    peerAddress: string;
  };
}) => {
  const xmtp = useXmtp({ wallet });
  const [stream, setStream] = useState<Lib.AsyncState<undefined> | null>(null);

  useEffect(() => {
    (async () => {
      if (xmtp === null || typeof conversation !== "object") {
        setStream(null);
      } else {
        setStream(await xmtp.getConversationStream(conversation));
      }
    })();
  }, [xmtp, typeof conversation !== "object"]);

  useEffect(() => {
    if (xmtp === null || typeof conversation !== "object") {
      return;
    } else {
      xmtp.subscribeToConversationStreamsStore(
        conversation,
        Comlink.proxy((stream) => {
          setStream(stream);
        })
      );
    }
  }, [xmtp, typeof conversation !== "object"]);

  if (xmtp === null) {
    return null;
  }

  if (typeof wallet !== "object") {
    return null;
  }

  if (typeof conversation !== "object") {
    return null;
  }

  if (stream === null) {
    return null;
  }

  return {
    start: () => xmtp.startConversationStream({ conversation }),
    stop: () => xmtp.stopConversationStream({ conversation }),
    listen: (handler: (m: Lib.Message) => void) =>
      xmtp.listenToConversationStream(conversation, Comlink.proxy(handler)),
    isIdle: stream.id === "idle",
    isPending: stream.id === "pending",
    isSuccess: stream.id === "success",
    isError: stream.id === "error",
    error: stream.error,
  };
};
