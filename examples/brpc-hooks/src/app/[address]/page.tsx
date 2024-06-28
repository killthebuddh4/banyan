"use client";

import { useWallet } from "@/hooks/useWallet";
import { useBrpcHookClient, useLogin, usePubSub } from "@killthebuddha/fig";
import { useEffect } from "react";
import { hook } from "@/lib/hook";
import { store } from "@/lib/store";
import { useParams } from "next/navigation.js";

export default function HookClient() {
  const { wallet, create } = useWallet();
  const hookServerAddress = useHookServerAddressParam();
  const eventCount = store((state) => state.eventCount);

  console.log("EVENT COUNT IN CLIENT", eventCount);

  useLogin({ wallet, opts: { autoLogin: true, env: "production" } });
  usePubSub({ wallet, opts: { autoStart: true } });

  const client = useBrpcHookClient({
    api: { hook },
    serverAddress: hookServerAddress,
    wallet,
  });

  useEffect(() => {
    if (wallet !== undefined) {
      return;
    }

    create();
  }, [wallet, create]);

  return (
    <div>
      <p>
        {(() => {
          if (wallet === undefined) {
            return "Loading wallet...";
          }

          return `Wallet address: ${wallet.address}`;
        })()}
      </p>

      {(() => {
        if (client === null) {
          return <div>Loading client...</div>;
        }

        return (
          <button
            onClick={async () => {
              try {
                console.log("CALLING ATTACH");
                const result = await client.attach();
                console.log("ATTACH RESULT", result);
              } catch (e) {
                console.error("ATTACH FAILED", e);
              }
            }}
          >
            ATTACH
          </button>
        );
      })()}
      <h1>Current count</h1>
      <p>{eventCount}</p>
    </div>
  );
}

const useHookServerAddressParam = () => {
  const params = useParams();
  const address = params.address;

  if (typeof address !== "string") {
    throw new Error("No group address provided");
  }

  return address;
};
