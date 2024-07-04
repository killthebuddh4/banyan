import { App } from "@/components/App";
import { useWallet } from "@/hooks/useWallet";
import { useLogin, useBrpc } from "@killthebuddha/fig";
import { MessagesForOwner } from "./MessagesForOwner";
import { OwnerInput } from "./OwnerInput";
import { join } from "@/lib/join";
import { post } from "@/lib/post";
import { sync } from "@/lib/sync";
import { useEffect, useMemo } from "react";
import { ownerStore } from "@/lib/ownerStore";

const consumerApi = {
  sync,
};

const providerApi = {
  join,
  post,
};

export const Owner = () => {
  const messages = ownerStore((s) => s.messages);
  const members = ownerStore((s) => s.members);

  const { wallet } = useWallet();

  if (wallet === undefined) {
    throw new Error("WHISPER :: Owner.tsx :: wallet === undefined");
  }

  useLogin({ wallet, opts: { autoLogin: true, env: "production" } });

  const brpc = useBrpc({ wallet });

  useEffect(() => {
    if (brpc.router === null) {
      return;
    }

    brpc.router({
      api: providerApi,
      topic: {
        peerAddress: "",
        context: {
          conversationId: "banyan.sh/whisper",
          metadata: {},
        },
      },
    });
  }, [brpc.router]);

  const clients = useMemo(() => {
    const client = brpc.client;

    if (client === null) {
      return null;
    }

    return Object.keys(members).map((address) => {
      return client({
        api: consumerApi,
        topic: {
          peerAddress: address,
          context: {
            conversationId: "banyan.sh/whisper",
            metadata: {},
          },
        },
      });
    });
  }, [brpc.client, members]);

  useEffect(() => {
    (async () => {
      if (clients === null) {
        return;
      }

      console.log(
        `WHISPER :: Owner.tsx :: syncing with ${clients.length} clients (there are ${Object.keys(members).length} members)`,
      );

      await Promise.all(
        clients.map(async (client) => {
          return client.sync({ messages });
        }),
      );

      console.log(
        "WHISPER :: Owner.tsx :: synced with ${clients.length} clients",
      );
    })();
  }, [clients, messages]);

  return (
    <App>
      <MessagesForOwner />
      <OwnerInput />
    </App>
  );
};
