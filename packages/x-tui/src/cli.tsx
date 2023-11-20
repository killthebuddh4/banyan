import { run as runGroup } from "./Group.js";
import { run as runOneOnOne } from "./OneOnOne.js";
import { program } from "commander";
import { start } from "./store.js";

program
  .requiredOption("-m, --mode <mode>")
  .requiredOption("-p, --peer-address <peerAddress>")
  .requiredOption("-k, --private-key <privateKey>")
  .action(async (options) => {
    start({ pk: options.privateKey, peerAddress: options.peerAddress });

    // Not sure if this is necessary, but it seems to be what full-screen CLI apps
    // do (such as tsc --watch).
    console.clear();

    if (options.m === "dm") {
      runOneOnOne({
        pk: options.privateKey,
        peerAddress: options.peerAddress,
      });
    } else {
      runGroup({
        pk: options.privateKey,
        peerAddress: options.peerAddress,
      });
    }
  })
  .parse();
