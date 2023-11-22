import { readConfig } from "../readConfig.js";

export const hasAlias = async ({ source }: { source: string }) => {
  const config = await readConfig();
  const aliasConfig = config.aliases.find((a) => a.source === source);
  return aliasConfig !== undefined;
};
