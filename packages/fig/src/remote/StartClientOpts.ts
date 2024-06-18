import { Signer } from "./Signer";

export type StartClientOpts = {
  wallet: Signer;
  env?: "dev" | "production";
  privateKeyOverride?: string;
};
