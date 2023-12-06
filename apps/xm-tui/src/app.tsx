import React from "react";
import { render } from "ink";
// import { Group } from "./Group.js";
import { program } from "commander";
import { optionsSchema } from "./cli/optionsSchema.js";
import { Router } from "./components/Router.js";
import { getDefaultConfigPath } from "xm-lib/config/getDefaultConfigPath.js";
import { setActiveConfigPath } from "xm-lib/config/setActiveConfigPath.js";

program
  .option(
    "-c, --config <path>",
    "Path to xrc config file",
    getDefaultConfigPath(),
  )
  .option("-p, --peer-address <peerAddress>")
  .action(async (rawOpts) => {
    console.log("rawOpts", rawOpts);
    console.log("dcp", getDefaultConfigPath());
    const options = optionsSchema.parse(rawOpts);

    setActiveConfigPath({ activeConfigPath: options.config });

    render(<Router options={options} />);
  })
  .parse();
