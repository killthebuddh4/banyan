import { readConfig } from "../config/readConfig.js";
import { writeConfig } from "../config/writeConfig.js";

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
