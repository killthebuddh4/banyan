"use client";

import { useEffect } from "react";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { http, createConfig, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { WALLETS, Walkthrough } from "./components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useClient } from "@killthebuddha/fig";

/* ****************************************************************************
 *
 * WALLET CONNECT CONFIG
 *
 * ****************************************************************************/

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

/* ****************************************************************************
 *
 * APP
 *
 * ****************************************************************************/

export default function App() {
  const client0 = useClient({ wallet: WALLETS[0] });
  const client1 = useClient({ wallet: WALLETS[1] });
  const client2 = useClient({ wallet: WALLETS[2] });

  useEffect(() => {
    if (client0 !== null) {
      client0.start();
    }
  }, [client0 === null]);

  useEffect(() => {
    if (client1 !== null) {
      client1.start();
    }
  }, [client1]);

  useEffect(() => {
    if (client2 !== null) {
      client2.start();
    }
  }, [client2]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <main className="h-screen w-screen flex flex-row p-8">
            <Walkthrough />
          </main>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
