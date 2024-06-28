"use client";

import { useWallet } from "@/hooks/useWallet";
import { useBrpcHookServer, useLogin, usePubSub } from "@killthebuddha/fig";
import { useEffect } from "react";
import { hook } from "@/lib/hook";

export default function HookServer() {
  const { wallet, create } = useWallet();
  useLogin({ wallet, opts: { autoLogin: true, env: "production" } });
  usePubSub({ wallet, opts: { autoStart: true } });

  const hooks = useBrpcHookServer({
    api: { hook },
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
        if (hooks === null) {
          return <div>Loading hooks...</div>;
        }

        return (
          <button
            onClick={async () => {
              try {
                console.log("CALLING HOOK");
                const result = await hooks.hook(1);
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
