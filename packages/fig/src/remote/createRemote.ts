import * as Comlink from "comlink";
import XmtpRemote from "./remote.js?worker&inline";
import { Actions } from "./Actions.js";

const REMOTES: Record<string, Actions> = {};

export const createRemote = ({ address }: { address: string }) => {
  if (REMOTES[address] === undefined) {
    REMOTES[address] = Comlink.wrap(new XmtpRemote());
  }

  return REMOTES[address];
};
