import { readConfig } from "../readConfig.js";

export const isTaken = async ({ alias }: { alias: string }) => {
  const config = await readConfig({});
  const aliasConfig = config.aliases.find((a) => a.alias === alias);
  return aliasConfig !== undefined;
};
