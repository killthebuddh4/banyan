"use client";

import { useRouter } from "next/navigation";
import { Wallet } from "@ethersproject/wallet";
import { useOwnerStore } from "./g/[address]/ownerApi";

export default function Home() {
  const router = useRouter();

  return (
    <div className="app">
      <div className="create">
        <div className="createInner">
          <p className="createInstructions">
            Click below to create an <b>ephemeral</b>, <b>private</b>,{" "}
            <b>end-to-end encrypted</b> groupchat.
          </p>
          <div className="createActions">
            <a className="learnMore" href="/">
              Learn More
            </a>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const wallet = Wallet.createRandom();

                useOwnerStore.setState((state) => {
                  return {
                    ...state,
                    wallet,
                  };
                });

                router.push(`/g/${wallet.address}`);
              }}
            >
              <button type="submit">Create</button>
            </form>
          </div>
        </div>
      </div>
      <form className="input" />
    </div>
  );
}
