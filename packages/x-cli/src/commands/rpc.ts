import { Command } from "commander";
import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { resolve } from "x-core/config/alias/resolve.js";
import { create as createServer } from "x-rpc/server/api/create.js";
import { start } from "x-rpc/server/api/start.js";
import { createClient } from "x-rpc/rpc/api/createClient.js";
import { createRoute } from "x-rpc/rpc/api/createRoute.js";
import { create as createContext } from "x-rpc/rpc/context/create.js";
import { readConfig } from "x-core/config/readConfig.js";
import { optionsStore } from "./x/optionsStore.js";
import { out } from "../out.js";
import { getPretty } from "./x/getPretty.js";
import { optionsSchema } from "./rpc/optionsSchema.js";
import { getArguments } from "./rpc/getArguments.js";

export const rpc = new Command("rpc")
  .requiredOption(
    "-s, --server <server>",
    "Alias or address of the server to connect to.",
  )
  .requiredOption("-m, --method <method>", "Method to call.")
  .requiredOption(
    "--args <input>",
    "Either JSON arguments for method or a path to a JSON file containing the arguments.",
  )
  .description("Create a new conversation")
  .action(async (rawOpts) => {
    const opts = optionsSchema.parse(rawOpts);
    const config = await readConfig({});
    const wallet = new Wallet(config.privateKey);
    const client = await Client.create(wallet, { env: "production" });
    const server = createServer({ usingClient: client });
    const serverAddress = await resolve({ aliasOrSource: opts.server });
    const stop = await start({ server });
    const rpcClient = createClient({
      remoteServerAddress: serverAddress,
      usingLocalServer: server,
      forRoute: createRoute({
        createContext,
        method: opts.method,
        inputSchema: z.unknown(),
        outputSchema: z.unknown(),
        handler: async () => undefined,
      }),
    });
    const input = getArguments({ userInput: opts.args });
    const response = await rpcClient(input);
    out({
      data: response,
      options: { pretty: getPretty({ store: optionsStore }) },
    });
    if (typeof stop === "function") {
      stop();
    }
  });
