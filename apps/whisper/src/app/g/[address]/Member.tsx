"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation.js";
import { useParams } from "next/navigation.js";
import { useBurnerWallet, useClient, useMessages } from "@killthebuddha/fig";

const X =
  "Nobody has joined yet. You'll be able to send messages here once someone joins.";

export const Member = () => {
  const { create, get } = useBurnerWallet({});
  const params = useParams();
  const address = params.address;

  if (typeof address !== "string") {
    throw new Error("Invalid address");
  }

  const wallet = (() => {
    let wallet = get({ opts: { name: address } });

    if (wallet === null) {
      create({ opts: { name: address, saveKey: true } });
    }

    wallet = get({ opts: { name: address } });

    if (wallet === null) {
      throw new Error("Failed to create wallet");
    }

    return wallet;
  })();

  const client = useClient({ wallet });

  useEffect(() => {
    if (client === null) {
      return;
    }

    if (client.start === null) {
      return;
    }

    client.start();
  }, [client]);

  const { send } = useMessages({ wallet });

  return (
    <div>
      <h1>{wallet.address}</h1>
      <button
        onClick={async () => {
          if (send === null) {
            console.log("send is null");
            return;
          }

          console.log("sending message");
          const ret = await send({
            conversation: { peerAddress: address },
            content: "Hello!",
          });
          console.log("sent message", ret);
        }}
      >
        Send
      </button>
    </div>
  );
};
