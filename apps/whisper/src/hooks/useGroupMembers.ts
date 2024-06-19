import { useWallet } from "./useWallet";
import { useGroupAddressParam } from "./useGroupAddressParam";
import { useMessages } from "@killthebuddha/fig";

export const useGroupMembers = () => {
  const { wallet } = useWallet();
  const groupAddress = useGroupAddressParam();
  const { messages } = useMessages({ wallet });

  const members = new Set<string>();

  if (groupAddress !== null) {
    members.add(groupAddress);
  }

  if (wallet !== undefined) {
    members.add(wallet.address);
  }

  for (const message of messages) {
    members.add(message.senderAddress);
  }

  return Array.from(members);
};
