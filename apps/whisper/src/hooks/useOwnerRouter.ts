"use client";

import { Signer } from "@killthebuddha/fig";
import { createRouter } from "@killthebuddha/brpc";
import { useJoin } from "./useJoin";
import { usePost } from "./usePost";
import { usePublish } from "./usePublish";
import { useSubscribe } from "./useSubscribe";
import { useEffect } from "react";

export const useOwnerRouter = ({ wallet }: { wallet?: Signer }) => {
  const publish = usePublish({ wallet });
  const subscribe = useSubscribe({ wallet });
  const join = useJoin();
  const post = usePost();

  useEffect(() => {
    if (wallet === undefined) {
      return;
    }

    const { start } = createRouter({
      api: { join, post },
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
