import { Signer } from "./Signer.js";

export type StartClientOpts = {
  wallet: Signer;
  env?: "dev" | "production";
  privateKeyOverride?: string;
};
