"use client";

import { Signer } from "@killthebuddha/fig";
import { useJoin } from "./useJoin";
import { usePost } from "./usePost";
import { usePublish } from "./usePublish";
import { useSubscribe } from "./useSubscribe";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@killthebuddha/brpc";

export const useOwnerClient = ({ wallet }: { wallet?: Signer }) => {
  const params = useParams();
  const serverAddress = params.address as string;

  if (typeof serverAddress !== "string") {
    throw new Error("Invalid address");
  }

  const join = useJoin();
  const post = usePost();
  const publish = usePublish({ wallet });
  const subscribe = useSubscribe({ wallet });

  return useMemo(() => {
    return createClient({
      api: { join, post },
      topic: {
        peerAddress: serverAddress,
        context: {
          conversationId: "banyan.sh/whisper",
          metadata: {},
        },
      },
      publish,
      subscribe,
    });
  }, [serverAddress, publish, subscribe]);
};
