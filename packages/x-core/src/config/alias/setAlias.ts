import { readConfig } from "../readConfig.js";
import { writeConfig } from "../writeConfig.js";

export const setAlias = async ({
  alias,
  source,
}: {
  alias: string;
  source: string;
}) => {
  const config = await readConfig();
  const aliases = config.aliases.filter((a) => a.source !== source);
  aliases.push({ alias, source });
  return writeConfig({ config: { ...config, aliases } });
};
