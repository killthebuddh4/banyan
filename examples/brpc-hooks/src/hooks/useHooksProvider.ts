import { useWallet } from "./useWallet";
import { useBrpc } from "@killthebuddha/fig";
import { useEffect, useMemo } from "react";
import { hook } from "@/lib/hook";
import { provider } from "@/lib/provider";
import { useConsumerStore } from "./useConsumerStore";

export const useHooksProvider = () => {
  const { wallet } = useWallet();
  const { client, router } = useBrpc({ wallet });
  const consumers = useConsumerStore((state) => state.consumers);

  useEffect(() => {
    if (router === null) {
      return;
    }

    const { unsubscribe } = router({
      api: provider,
      topic: {
        peerAddress: "",
        context: {
          conversationId: "banyan.sh/brpc-hooks",
          metadata: {},
        },
      },
    });

    return unsubscribe;
  }, [router]);

  return useMemo(() => {
    if (client === null) {
      return null;
    }

    return consumers.map((address) => {
      return client({
        api: { hook },
        topic: {
          peerAddress: address,
          context: {
            conversationId: "banyan.sh/brpc-hooks",
            metadata: {},
          },
        },
      });
    });
  }, [client, consumers]);
};
