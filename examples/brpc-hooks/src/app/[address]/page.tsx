"use client";

import { useWallet } from "@/hooks/useWallet";
import { useLogin, usePubSub } from "@killthebuddha/fig";
import { useEffect } from "react";
import { useHooksConsumer } from "@/hooks/useHooksConsumer";
import { useEventCountStore } from "@/hooks/useEventCountStore";

export default function HookConsumer() {
  const { wallet, create } = useWallet();

  useLogin({ wallet, opts: { autoLogin: true, env: "production" } });
  usePubSub({ wallet, opts: { autoStart: true } });
  const client = useHooksConsumer();

  const eventCount = useEventCountStore((state) => state.eventCount);

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
