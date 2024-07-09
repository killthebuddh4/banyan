import * as Comlink from "comlink";
import { Actions } from "../remote/Actions.js";
import XmtpRemote from "../remote/worker.js?worker&inline";
import { Signer } from "../remote/Signer.js";

const REMOTES: Record<string, Actions | undefined> = {};

export const useRemote = (props: { wallet: Signer }) => {
  if (REMOTES[props.wallet.address] === undefined) {
    REMOTES[props.wallet.address] = Comlink.wrap(new XmtpRemote());
  }

  return REMOTES[props.wallet.address] as Actions;
};
