import * as Comlink from "comlink";
import XmtpRemote from "./remote.js?worker&inline";
import { Actions } from "./Actions.js";

const REMOTES: Record<string, Actions> = {};

export const createRemote = ({ wallet }: { wallet?: { address: string } }) => {
  if (wallet === undefined) {
    return null;
  }

  if (REMOTES[wallet.address] === undefined) {
    REMOTES[wallet.address] = Comlink.wrap(new XmtpRemote());
  }

  return REMOTES[wallet.address];
};
