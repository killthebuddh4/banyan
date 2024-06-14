import * as Comlink from "comlink";
import XmtpWorker from "./worker.js?worker&inline";
import { RemoteApi } from "./RemoteApi";

const WORKERS: Record<string, Comlink.Remote<RemoteApi>> = {};

export const createWorker = ({ wallet }: { wallet?: { address: string } }) => {
  if (wallet === undefined) {
    return null;
  }

  if (WORKERS[wallet.address] === undefined) {
    WORKERS[wallet.address] = Comlink.wrap(new XmtpWorker());
  }

  return WORKERS[wallet.address];
};
