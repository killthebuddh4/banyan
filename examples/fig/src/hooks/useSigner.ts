import { useMemo } from "react";
import { useAccount, useSignMessage } from "wagmi";

export const useSigner = () => {
  const account = useAccount();
  const { signMessageAsync } = useSignMessage();
  const address = account.address;

  /* This feels really stupid, there has to be an easier way. Ultimately the
   * problem is that we're using Wagmi -> Viem whereas XMTP expects an Ethers ->
   * Signer. */
  return useMemo(() => {
    if (typeof address !== "string") {
      return undefined;
    } else {
      return {
        address,
        getAddress: async () => address,
        signMessage: async (message: string) => {
          return signMessageAsync({ message });
        },
      };
    }
  }, [address, signMessageAsync]);
};
