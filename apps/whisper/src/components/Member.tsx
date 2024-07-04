import { App } from "@/components/App";
import { useEffect, useMemo } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useLogin, useBrpc } from "@killthebuddha/fig";
import { MessagesForMember } from "./MessagesForMember";
import { Input } from "@/components/Input";
import { join } from "@/lib/join";
import { sync } from "@/lib/sync";
import { useGroupAddressParam } from "@/hooks/useGroupAddressParam";

const consumerApi = {
  sync,
};

const providerApi = {
  join,
};

export const Member = () => {
  const { wallet, create } = useWallet();

  useEffect(() => {
    create();
  }, []);

  useLogin({ wallet, opts: { autoLogin: true, env: "production" } });

  const serverAddress = useGroupAddressParam();

  const brpc = useBrpc({ wallet });

  const client = useMemo(() => {
    if (brpc.client === null) {
      return null;
    }

    return brpc.client({
      api: providerApi,
      topic: {
        peerAddress: serverAddress,
        context: {
          conversationId: "banyan.sh/whisper",
          metadata: {},
        },
      },
    });
  }, [brpc.client, serverAddress]);

  useEffect(() => {
    (async () => {
      if (client === null) {
        return;
      }

      const joined = await client.join();

      console.log("WHISPER :: Member.tsx :: joined", joined);
    })();
  }, [client]);

  useEffect(() => {
    (async () => {
      if (brpc.router === null) {
        return;
      }

      const router = brpc.router({
        api: consumerApi,
        topic: {
          peerAddress: serverAddress,
          context: {
            conversationId: "banyan.sh/whisper",
            metadata: {},
          },
        },
      });

      console.log("WHISPER :: Member.tsx :: router", router);
    })();
  }, [brpc.router, serverAddress]);

  return (
    <App>
      <MessagesForMember />
      <Input />
    </App>
  );
};
