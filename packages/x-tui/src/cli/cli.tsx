import React from "react";
import { render } from "ink";
// import { Group } from "./Group.js";
import { program } from "commander";
import { optionsSchema } from "./optionsSchema.js";
import { Router } from "../components/Router.js";
import { getDefaultConfigPath } from "x-core/config/getDefaultConfigPath.js";
import { setActiveConfigPath } from "x-core/config/setActiveConfigPath.js";

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
