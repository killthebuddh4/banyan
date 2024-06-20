import { useMemo } from "react";
import { Signer } from "../remote/Signer.js";
import { createRemote } from "../remote/createRemote.js";

export const useRemote = ({ wallet }: { wallet?: Signer }) => {
  return useMemo(() => {
    if (wallet === undefined) {
      return null;
    }

    return createRemote({ address: wallet.address });
  }, [wallet]);
};
