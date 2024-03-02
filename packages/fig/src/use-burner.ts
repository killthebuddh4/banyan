import { Wallet } from "@ethersproject/wallet";
import { useClient } from "./use-client";
import { useEffect } from "react";

const BURNER_KEY = "relay-network-burner-key";

export const useBurner = () => {
  const key = localStorage.getItem(BURNER_KEY);

  const burner = (() => {
    try {
      if (key === null) {
        return Wallet.createRandom();
      } else {
        return new Wallet(key);
      }
    } catch (e) {
      return Wallet.createRandom();
    }
  })();

  localStorage.setItem(BURNER_KEY, burner.privateKey);

  const client = useClient({ wallet: burner });

  useEffect(() => {
    if (client === null) {
      return;
    }

    console.log("USE BURNER STARTING CLIENT");
    client
      .start()
      .then((r) => console.log("USE BURNER START CLIENT RESULT", r));
  }, [client === null]);

  return burner;
};
