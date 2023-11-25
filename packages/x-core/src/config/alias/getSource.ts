import { readConfig } from "../readConfig.js";

export const getSource = async ({ forAlias }: { forAlias: string }) => {
  const config = await readConfig();
  const aliasConfig = config.aliases.find((a) => a.alias === forAlias);
  if (!aliasConfig) {
    throw new Error(`No alias found for ${forAlias}`);
  }
  return aliasConfig.source;
};
