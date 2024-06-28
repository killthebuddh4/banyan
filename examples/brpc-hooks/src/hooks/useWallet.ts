import { create } from "zustand";
import { Signer } from "@killthebuddha/fig";
import { Wallet } from "@ethersproject/wallet";
import { useCallback } from "react";

export const useWalletStore = create<{
  wallet: Signer | undefined;
  setWallet: (wallet: Signer | undefined) => void;
}>((set) => ({
  wallet: undefined,
  setWallet: (wallet) => set({ wallet }),
}));

export const useWallet = () => {
  const store = useWalletStore();

  const create = useCallback(() => {
    if (store.wallet !== undefined) {
      return store.wallet;
    }

    const wallet = Wallet.createRandom();
    store.setWallet(wallet);
    return wallet as Signer;
  }, [store.wallet]);

  return {
    wallet: store.wallet,
    create,
  };
};
