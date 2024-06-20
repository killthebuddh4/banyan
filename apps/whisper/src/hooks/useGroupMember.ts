import { useBrpcClient } from "@killthebuddha/fig";
import { join } from "@/brpc/join";
import { useGroupAddressParam } from "./useGroupAddressParam";
import { useWallet } from "./useWallet";
import { useMemo } from "react";

export const useGroupMember = () => {
  const { wallet } = useWallet();

  useMemo(() => {
    console.log("WHISPER :: useGroupMember :: TEST wallet memo running");
  }, [wallet]);

  const groupAddress = useGroupAddressParam();

  return useBrpcClient({
    wallet,
    api: { join },
    address: groupAddress,
  });
};
