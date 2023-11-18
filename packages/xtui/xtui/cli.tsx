#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import { App } from "./App.js";

const cli = meow(
  `
	Usage
	  $ xtui

	Options
		--pk Your private key
		--peer Peer address
`,
  {
    importMeta: import.meta,
    flags: {
      pk: {
        type: "string",
        isRequired: true,
      },
      peer: {
        type: "string",
        isRequired: true,
      },
    },
  },
);

render(<App pk={cli.flags.pk} peer={cli.flags.peer} />);
