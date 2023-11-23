import React from "react";
import { z } from "zod";
import { render } from "ink";
import { Group } from "./Group.js";
import { DirectMessage } from "./DirectMessage.js";
import { ConversationList } from "./ConversationList.js";
import { program } from "commander";

program
  .requiredOption("-p, --peer-address <peerAddress>")
  .requiredOption("-k, --private-key <privateKey>")
  .option("-m, --mode <mode>", "dm or group or list", "dm")
  .action(async (rawOpts) => {
    // Not sure if this is necessary, but it seems to be what full-screen CLI apps
    // do (such as tsc --watch).
    console.clear();

    const options = z
      .object({
        mode: z.enum(["list", "dm", "group"]),
        privateKey: z.string(),
        peerAddress: z.string(),
      })
      .parse(rawOpts);

    if (options.mode === "group") {
      render(
        <Group pk={options.privateKey} peerAddress={options.peerAddress} />,
      );
    } else if (options.mode === "dm") {
      render(
        <DirectMessage
          pk={options.privateKey}
          peerAddress={options.peerAddress}
        />,
      );
    } else if (options.mode === "list") {
      render(<ConversationList pk={options.privateKey} />);
    } else {
      throw new Error(`Unknown mode ${options.mode}`);
    }
  })
  .parse();
