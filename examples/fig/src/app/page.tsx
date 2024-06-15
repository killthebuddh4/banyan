"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { http, createConfig, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { Walkthrough } from "./components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Main } from "@/ui/Main";
import { Header } from "@/ui/Header";
import { Splash } from "@/components/Splash";

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
        <Main>
          <Header />
          <Splash />
        </Main>

        <div
          id="features"
          className="min-h-[100vh] flex flex-col items-center justify-center"
        >
          <h1>Features</h1>
        </div>

        <div
          id="get-started"
          className="min-h-[100vh] flex flex-col items-center justify-center"
        >
          <h1>Get Started</h1>
        </div>

        <div
          id="api-reference"
          className="min-h-[100vh] flex flex-col items-center justify-center"
        >
          <h1>API Reference</h1>
        </div>

        <div
          id="learn-more"
          className="min-h-[100vh] flex flex-col items-center justify-center"
        >
          <h1>Learn More</h1>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
