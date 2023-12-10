import { Wallet } from "@ethersproject/wallet";
import { readConfig } from "xm-lib/config/readConfig.js";
import { parseConfigPath } from "xm-lib/config/parseConfigPath.js";

export const getTesterWallet = async () => {
  const config = await readConfig({
    overridePath: parseConfigPath({ rawPath: "~/.xrc.val.tester.json" }),
  });
  return new Wallet(config.privateKey);
};
