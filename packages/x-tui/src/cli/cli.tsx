import React from "react";
import { render } from "ink";
// import { Group } from "./Group.js";
import { program } from "commander";
import { optionsSchema } from "./optionsSchema.js";
import { Router } from "../router/Router.js";

program
  .requiredOption("-k, --private-key <privateKey>")
  .option("-p, --peer-address <peerAddress>")
  .action(async (rawOpts) => {
    const options = optionsSchema.parse(rawOpts);

    render(<Router options={options} />);
  })
  .parse();
