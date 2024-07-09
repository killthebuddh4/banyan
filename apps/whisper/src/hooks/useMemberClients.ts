import { Signer } from "@killthebuddha/fig";
import { createClient } from "@killthebuddha/brpc";
import { useOwnerStore } from "./useOwnerStore";
import { usePing } from "./usePing";
import { useSync } from "./useSync";
import { usePublish } from "./usePublish";
import { useSubscribe } from "./useSubscribe";
import { useMemo } from "react";

export const useMemberClients = ({ wallet }: { wallet?: Signer }) => {
  const ping = usePing();
  const sync = useSync();
  const publish = usePublish({ wallet });
  const subscribe = useSubscribe({ wallet });
  const members = useOwnerStore((s) => s.members);

  return useMemo(() => {
    return Object.keys(members).map((address) => {
      return createClient({
        api: { sync, ping },
        publish,
        subscribe,
        topic: {
          peerAddress: address,
          context: {
            conversationId: "banyan.sh/whisper",
            metadata: {},
          },
        },
      });
    });
  }, [members, publish, subscribe]);
};
