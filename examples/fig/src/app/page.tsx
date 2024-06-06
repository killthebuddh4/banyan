"use client";

import "./polyfills";
import { useEffect } from "react";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, zora } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { WALLETS, Walkthrough } from "./components";
import { useClient } from "@killthebuddha/fig";

/* ****************************************************************************
 *
 * WALLET CONNECT CONFIG
 *
 * ****************************************************************************/

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, zora],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: "Fig",
  projectId: "18f0509314edaa4e93ceb0a4e9d534dd",
  chains,
});

const wagmiConfig = createConfig({
  connectors,
  publicClient,
});

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
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <main className="h-screen w-screen flex flex-row p-8">
          <Walkthrough />
        </main>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
