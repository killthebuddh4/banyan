import { z } from "zod";
import { Command } from "commander";
import { createClient as createChannelCreateClient } from "x-core/actions/create-channel/createClient.js";
import { createServer } from "x-core/xmtp/server/create.js";
import { start } from "x-core/xmtp/server/start.js";
import { stop } from "x-core/xmtp/server/stop.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { readConfig } from "../../../config/readConfig.js";
import { isTaken } from "../../../config/alias/isTaken.js";
import { setAlias } from "../../../config/alias/setAlias.js";

export const create = new Command("create")
  .description("Create a new group")
  .requiredOption("-g, --group <group>", "Group alias")
  .requiredOption("-d, --description <description>", "Group description")
  .action(async (rawOpts) => {
    const options = z
      .object({
        group: z.string(),
        description: z.string(),
      })
      .parse(rawOpts);

    const aliasIsTaken = await isTaken({ alias: options.group });

    if (aliasIsTaken) {
      throw new Error(`Alias ${options.group} is already taken`);
    }

    const config = await readConfig();
    const wallet = new Wallet(config.privateKey);
    const xmtpClient = await Client.create(wallet, { env: "production" });
    const server = createServer({ fromClient: xmtpClient });
    await start({ server });

    const client = createChannelCreateClient({
      usingLocalServer: server,
      forRemoteServerAddress: config.groupServerAddress,
    });

    const created = await client({
      name: options.group,
      description: options.description,
    });

    if (!created.ok) {
      // TODO
    } else {
      await setAlias({
        alias: options.group,
        source: created.result.createdChannelAddress,
      });

      console.log(JSON.stringify(created, null, 2));
      stop({ server });
    }
  });
