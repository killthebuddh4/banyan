"use client";

import { useWallet } from "@/hooks/useWallet";
import { useGroupAddressParam } from "@/hooks/useGroupAddressParam";
import { Owner } from "./Owner";
import { Member } from "./Member";

export default function Home() {
  const { wallet, create } = useWallet();
  const groupAddress = useGroupAddressParam();

  if (wallet === undefined) {
    create();
    return null;
  }

  if (wallet.address === groupAddress) {
    return <Owner />;
  }

  return <Member />;
}
