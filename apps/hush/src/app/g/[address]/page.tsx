"use client";

import { useParams } from "next/navigation.js";
import { useOwnerStore } from "@/hooks/useOwnerStore";
import { Member } from "@/components/Member";
import { Owner } from "@/components/Owner";

export default function Page() {
  const wallet = useOwnerStore((s) => s.wallet);
  const params = useParams();

  console.log(wallet, params.address);

  if (wallet === undefined) {
    return <Member />;
  }

  if (wallet.address !== params.address) {
    return <Member />;
  }

  return <Owner />;
}
