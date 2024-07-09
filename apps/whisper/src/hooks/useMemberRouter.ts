import { createClient, createRouter } from "@killthebuddha/brpc";
import { useEffect, useMemo } from "react";
import { usePublish } from "./usePublish";
import { useSubscribe } from "./useSubscribe";
import { useSync } from "./useSync";
import { usePing } from "./usePing";
import { useParams } from "next/navigation.js";
import { Signer } from "@killthebuddha/fig";

export const useMemberRouter = ({ wallet }: { wallet?: Signer }) => {
  const publish = usePublish({ wallet });
  const subscribe = useSubscribe({ wallet });
  const sync = useSync();
  const ping = usePing();

  useEffect(() => {
    if (wallet === undefined) {
      return;
    }

    const { start } = createRouter({
      api: { sync, ping },
      topic: {
        peerAddress: wallet.address,
        context: { conversationId: "banyan.sh/whisper", metadata: {} },
      },
      publish,
      subscribe,
    });

    const { stop } = start();

    return stop;
  }, [wallet, publish, subscribe]);
};
