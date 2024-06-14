import { Wallet } from "@ethersproject/wallet";

const BURNER_KEY = "fig-burner-key";

export const useBurnerWallet = ({
  opts,
}: {
  opts?: { fallbackOnSavedKeyError?: boolean };
}) => {
  const key = localStorage.getItem(BURNER_KEY);

  const burner = (() => {
    try {
      if (key === null) {
        return Wallet.createRandom();
      } else {
        return new Wallet(key);
      }
    } catch (e) {
      if (opts?.fallbackOnSavedKeyError !== false) {
        return Wallet.createRandom();
      } else {
        throw e;
      }
    }
  })();

  localStorage.setItem(BURNER_KEY, burner.privateKey);

  return burner;
};
