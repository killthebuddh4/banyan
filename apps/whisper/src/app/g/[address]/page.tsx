"use client";

import { useBurnerWallet } from "@killthebuddha/fig";
import { useParams } from "next/navigation.js";
import { Owner } from "./Owner";
import { Member } from "./Member";

export default function Groupchat() {
  const { get } = useBurnerWallet({});
  const wallet = get({});
  const params = useParams();
  const address = params.address;

  if (address === undefined) {
    return null;
  }

  if (wallet === null) {
    return <Member />;
  }

  if (wallet.address !== address) {
    return <Member />;
  }

  return <Owner />;
}
