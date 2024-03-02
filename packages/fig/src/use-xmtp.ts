import * as Comlink from "comlink";
import * as Lib from "./lib";
import Actions from "./use-xmtp.worker.js?worker&inline";

const WORKERS: Record<string, Comlink.Remote<Lib.Actions>> = {};

export const useXmtp = ({
  wallet,
}: {
  wallet?: { address: string };
}): Comlink.Remote<Lib.Actions> | null => {
  if (typeof wallet !== "object") {
    return null;
  } else {
    if (WORKERS[wallet.address + "production"]) {
      return WORKERS[wallet.address + "production"];
    } else {
      WORKERS[wallet.address + "production"] = Comlink.wrap(new Actions());
      return WORKERS[wallet.address + "production"];
    }
  }
};
