import { useWallet } from "./useWallet";
import { useBrpc } from "@killthebuddha/fig";
import { provider } from "@/lib/provider";
import { hook } from "@/lib/hook";
import { useEffect, useMemo } from "react";
import { useHooksProviderAddress } from "./useHooksProviderAddress";

export const useHooksConsumer = () => {
  const { wallet } = useWallet();
  const { client: bindClient, router: bindRouter } = useBrpc({ wallet });

  useEffect(() => {
    if (bindRouter === null) {
      return;
    }

    const { unsubscribe } = bindRouter({
      api: { hook },
      topic: {
        peerAddress: "",
        context: {
          conversationId: "banyan.sh/brpc-hooks",
          metadata: {},
        },
      },
    });

    return unsubscribe;
  }, [bindRouter]);

  const address = useHooksProviderAddress();

  return useMemo(() => {
    if (bindClient === null) {
      return null;
    }

    return bindClient({
      api: provider,
      topic: {
        peerAddress: address,
        context: {
          conversationId: "banyan.sh/brpc-hooks",
          metadata: {},
        },
      },
    });
  }, [bindClient, address]);
};
