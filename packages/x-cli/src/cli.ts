import { z } from "zod";
import { program } from "commander";
import { createClient as createChannelCreateClient } from "x-core/actions/create-channel/createClient.js";
import { createServer } from "x-core/xmtp/server/create.js";
import { start } from "x-core/xmtp/server/start.js";
import { stop } from "x-core/xmtp/server/stop.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";

const CONFIG = {
  privateKey: z.string().parse(process.env.XGC_PRIVATE_KEY),
  remoteServerAddress: "0xD7C0462bFc1f9cB88e31748b0E3Db018821Ec193",
};

const wallet = Wallet.createRandom();
const client = await Client.create(wallet, { env: "production" });
const server = createServer({ fromClient: client });

program
  .command("create-channel")
  .description("Create a channel")
  .requiredOption("-n, --name <name>", "Channel name")
  .requiredOption("-d, --description <description>", "Channel description")
  .action(async (options) => {
    await start({ server });

    const client = createChannelCreateClient({
      usingLocalServer: server,
      forRemoteServerAddress: CONFIG.remoteServerAddress,
    });

    const created = await client({
      name: options.name,
      description: options.description,
    });

    console.log(created);
    stop({ server });
  });

program.parse();
