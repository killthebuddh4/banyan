"use client";

import { useWallet } from "@/hooks/useWallet";
import { useGroupAddressParam } from "@/hooks/useGroupAddressParam";
import { Owner } from "@/components/Owner";
import { Member } from "@/components/Member";

export default function Home() {
  const { wallet } = useWallet();
  const groupAddress = useGroupAddressParam();

  if (wallet === undefined) {
    return <Member />;
  }

  if (wallet.address !== groupAddress) {
    return <Member />;
  }

  return <Owner />;
}
