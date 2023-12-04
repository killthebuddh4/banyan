import { Command } from "commander";
import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { resolve } from "xm-lib/config/alias/resolve.js";
import { create as createServer } from "@killthebuddha/xm-rpc/server/api/create.js";
import { start } from "@killthebuddha/xm-rpc/server/api/start.js";
import { createClient } from "@killthebuddha/xm-rpc/rpc/api/createClient.js";
import { createRoute } from "@killthebuddha/xm-rpc/rpc/api/createRoute.js";
import { createStream } from "@killthebuddha/xm-rpc/rpc/api/createStream.js";
import { create as createContext } from "@killthebuddha/xm-rpc/rpc/context/create.js";
import { readConfig } from "xm-lib/config/readConfig.js";
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
  .option("--stream", "Expect a streaming response.")
  .description("Create a new conversation")
  .action(async (rawOpts) => {
    const opts = optionsSchema.parse(rawOpts);
    const config = await readConfig({});
    const wallet = new Wallet(config.privateKey);
    const client = await Client.create(wallet, { env: "production" });
    const server = createServer({
      usingClient: client,
      options: {
        onMessageReceived: ({ message }) => {
          console.log("message received", message.content);
        },
      },
    });
    const serverAddress = await resolve({ aliasOrSource: opts.server });

    const rpcServerArgs = {
      remoteServerAddress: serverAddress,
      usingLocalServer: server,
      forRoute: createRoute({
        createContext,
        method: opts.method,
        inputSchema: z.unknown(),
        outputSchema: z.unknown(),
        handler: async () => undefined,
      }),
    };

    const input = getArguments({ userInput: opts.args });

    const pretty = getPretty({ store: optionsStore });

    const stop = await start({ server });

    if (opts.stream) {
      const rpcStream = await createStream(rpcServerArgs)({ input });

      for await (const message of rpcStream) {
        out({ data: message, options: { pretty } });
      }
    } else {
      const rpcClient = createClient(rpcServerArgs);
      const response = await rpcClient(input);
      out({ data: response, options: { pretty } });
    }

    if (typeof stop === "function") {
      stop();
    }
  });
