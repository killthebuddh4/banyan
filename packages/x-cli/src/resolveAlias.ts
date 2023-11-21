import { readConfig } from "./config/readConfig.js";

export const resolveAlias = async ({ alias }: { alias: string }) => {
  const config = await readConfig();
  const aliasConfig = config.aliases.find((a) => a.alias === alias);
  if (!aliasConfig) {
    throw new Error(`No alias found for ${alias}`);
  }
  return aliasConfig.source;
};
