"use client";

import { http, createConfig, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Main } from "@/ui/Main";
import { Header } from "@/ui/Header";
import { Splash } from "@/components/Splash";

/* ****************************************************************************
 *
 * WAGMI
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

          <div
            id="overview"
            className="flex flex-col items-center py-24 justify-center border-slate-900"
          >
            <h1 className="text-4xl mb-4">Overview</h1>
            <h2 className="max-w-[50ch] mb-8 text-center">
              Fig is a collection of React hooks that make it easy to build
              applications on top of{" "}
              <a href="https://xmtp.org" target="_blank">
                XMTP
              </a>
              {". "}
              XMTP is a fully open, end-to-end encrypted messaging protocol and{" "}
              <a
                href="https://github.com/xmtp/xmtp-js"
                target="_blank"
                rel="noreferrer"
              >
                SDK
              </a>
              .
            </h2>
            <div className="flex flex-row flex-wrap gap-8 p-8">
              <div className="border-2 border-slate-900 p-4 flex flex-col gap-2 w-60">
                <h3 className="font-bold text-2xl">Performant</h3>
                <p>
                  Fig wraps the XMTP SDK in a <a href="/">web worker</a> so that
                  your application can remain responsive under heavy load.
                </p>
              </div>
              <div className="border-2 border-slate-900 p-4 flex flex-col gap-2  w-60">
                <h3 className="text-2xl font-bold">Type-safe</h3>
                <p>
                  Fig is a modern JavaScript library written in TypeScript,
                  providing out-of-the-box support for type safety and code
                  completion.
                </p>
              </div>
              <div className="border-2 border-slate-900 p-4 flex flex-col gap-2  w-60">
                <h3 className="text-2xl font-bold">Ergonomic API</h3>
                <p>
                  Fig's hooks are designed to be easy to use and composable,
                  they don't require any special configuration or context
                  providers. Just import and use.
                </p>
              </div>
              <div className="border-2 border-slate-900 p-4 flex flex-col gap-2  w-60">
                <h3 className="text-2xl font-bold">Expressive</h3>
                <p>
                  Fig provides a deep integration with{" "}
                  <a href="https://github.com/killthebuddh4/banyan/tree/master/packages/brpc">
                    brpc
                  </a>
                  , an RPC protocol and library built on top of XMTP. With Fig
                  and brpc you can build powerful, peer-to-peer, secure
                  applications with ease.
                </p>
              </div>
            </div>
          </div>

          <div
            id="quickstart"
            className="min-h-[100vh] flex flex-col items-center justify-center"
          >
            <h1>Quickstart</h1>
          </div>

          <div
            id="documentation"
            className="min-h-[100vh] flex flex-col items-center justify-center"
          >
            <h1>Documentation</h1>
          </div>

          <div
            id="learn-more"
            className="min-h-[100vh] flex flex-col items-center justify-center"
          >
            <h1>Learn More</h1>
          </div>
        </Main>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
