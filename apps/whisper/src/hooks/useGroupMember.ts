import { useBrpcClient } from "@killthebuddha/fig";
import { join } from "@/brpc/join";
import { useGroupAddressParam } from "./useGroupAddressParam";
import { useWallet } from "./useWallet";

export const useGroupMember = () => {
  const { wallet } = useWallet();
  const groupAddress = useGroupAddressParam();

  return useBrpcClient({
    wallet,
    api: { join },
    address: groupAddress,
  });
};
