"use client";

import { useWallet } from "@/hooks/useWallet";
import { useLogin, usePubSub } from "@killthebuddha/fig";
import { useEffect } from "react";
import { useHooksProvider } from "@/hooks/useHooksProvider";
import { useConsumerStore } from "@/hooks/useConsumerStore";

export default function HookProvider() {
  const { wallet, create } = useWallet();
  useLogin({ wallet, opts: { autoLogin: true, env: "production" } });
  usePubSub({ wallet, opts: { autoStart: true } });

  const consumers = useConsumerStore((state) => state.consumers);

  const clients = useHooksProvider();

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
      <p>{`There are currently ${consumers.length} consumers connected.`}</p>
      {(() => {
        return (
          <button
            onClick={async () => {
              if (clients === null) {
                return;
              }
              try {
                console.log("CALLING HOOK");
                const result = await Promise.all(
                  clients.map((client) => client.hook(1)),
                );
                console.log("HOOK RESULT", result);
              } catch (e) {
                console.error("HOOK FAILED", e);
              }
            }}
          >
            Increment
          </button>
        );
      })()}
    </div>
  );
}
