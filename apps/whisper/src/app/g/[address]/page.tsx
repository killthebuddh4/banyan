"use client";

import { useOwnerStore } from "./ownerApi";
import { Owner } from "./Owner";
import { Member } from "./Member";

export default function Home() {
  const wallet = useOwnerStore((s) => s.wallet);

  if (wallet === null) {
    return <Member />;
  }

  return <Owner />;
}
