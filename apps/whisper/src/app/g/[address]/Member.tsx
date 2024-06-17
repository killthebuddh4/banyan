"use client";

import { useState } from "react";
import { usePathname } from "next/navigation.js";
import { useParams } from "next/navigation.js";
import { useBurnerWallet, useClient } from "@killthebuddha/fig";

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

  return <h1>{wallet.address}</h1>;
};
