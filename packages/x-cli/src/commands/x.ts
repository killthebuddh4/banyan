import { z } from "zod";
import { Command } from "commander";
import { getDefaultConfigPath } from "x-core/config/getDefaultConfigPath.js";
import { setActiveConfigPath } from "x-core/config/setActiveConfigPath.js";

export const x = new Command()
  .option(
    "-c, --config <config>",
    "Path to config file",
    getDefaultConfigPath(),
  )
  .hook("preAction", async (cmd) => {
    const opts = z
      .object({
        config: z.string(),
      })
      .parse(cmd.opts());

    setActiveConfigPath({ activeConfigPath: opts.config });
  });
