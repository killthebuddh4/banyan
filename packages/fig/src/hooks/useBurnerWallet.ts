import { Wallet } from "@ethersproject/wallet";

const BURNER_KEY = "fig-burner-key";

export const useBurnerWallet = ({
  opts,
}: {
  opts?: {
    name?: string;
    saveKey?: boolean;
    useSavedKey?: boolean;
    fallbackOnSavedKeyError?: boolean;
  };
}) => {
  const create = ({
    opts,
  }: {
    opts?: {
      name?: string;
      saveKey?: boolean;
      useSavedKey?: boolean;
      fallbackOnSavedKeyError?: boolean;
    };
  }) => {
    const wallet = (() => {
      const useSavedKey = (() => {
        if (opts?.useSavedKey === undefined) {
          return false;
        }

        return opts.useSavedKey;
      })();

      if (!useSavedKey) {
        return Wallet.createRandom();
      }

      try {
        const localStorageKey = (() => {
          if (opts?.name !== undefined) {
            return `${BURNER_KEY}-${opts.name}`;
          }

          return BURNER_KEY;
        })();

        const privateKey = localStorage.getItem(localStorageKey);

        if (privateKey === null) {
          return Wallet.createRandom();
        } else {
          return new Wallet(privateKey);
        }
      } catch (e) {
        const fallbackOnSavedKeyError = (() => {
          if (opts?.fallbackOnSavedKeyError === undefined) {
            return true;
          }

          return opts.fallbackOnSavedKeyError;
        })();

        if (fallbackOnSavedKeyError) {
          return Wallet.createRandom();
        } else {
          throw e;
        }
      }
    })();

    const saveKey = (() => {
      if (opts?.saveKey === undefined) {
        return false;
      }

      return opts.saveKey;
    })();

    if (saveKey) {
      const localStorageKey = (() => {
        if (opts?.name !== undefined) {
          return `${BURNER_KEY}-${opts.name}`;
        }

        return BURNER_KEY;
      })();

      localStorage.setItem(localStorageKey, wallet.privateKey);
    }
  };

  const get = ({
    opts,
  }: {
    opts?: {
      name?: string;
    };
  }) => {
    const localStorageKey = (() => {
      if (opts?.name !== undefined) {
        return `${BURNER_KEY}-${opts.name}`;
      }

      return BURNER_KEY;
    })();

    const privateKey = localStorage.getItem(localStorageKey);

    if (privateKey === null) {
      return null;
    }

    return new Wallet(privateKey);
  };

  return { create, get };
};
