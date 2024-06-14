"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { http, createConfig, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { Walkthrough } from "./components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
