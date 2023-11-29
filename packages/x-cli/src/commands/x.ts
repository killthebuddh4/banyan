import { Command } from "commander";
import { getDefaultConfigPath } from "x-core/config/getDefaultConfigPath.js";
import { setActiveConfigPath } from "x-core/config/setActiveConfigPath.js";
import { optionsStore } from "./x/optionsStore.js";
import { setOptions } from "./x/setOptions.js";
import { optionsSchema } from "./x/optionsSchema.js";

export const x = new Command()
  .option(
    "-c, --config <config>",
    "Path to config file",
    getDefaultConfigPath(),
  )
  .option("--pretty [false]", "Pretty print JSON")
  .hook("preAction", async (cmd) => {
    const opts = optionsSchema.parse(cmd.opts());

    setOptions({
      store: optionsStore,
      options: { pretty: opts.pretty },
    });

    setActiveConfigPath({ activeConfigPath: opts.config });
  });
