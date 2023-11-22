import { z } from "zod";
import { Command } from "commander";
import { createClient } from "x-core/actions/invite-member-to-channel/createClient.js";
import { createServer } from "x-core/xmtp/server/create.js";
import { start } from "x-core/xmtp/server/start.js";
import { stop } from "x-core/xmtp/server/stop.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { readConfig } from "../../../config/readConfig.js";
import { resolve } from "../../../config/alias/resolve.js";

export const invite = new Command("invite")
  .description("Invite a user to a group")
  .requiredOption("-g, --group <group>", "Group alias or address")
  .requiredOption("-u, --user <user>", "User alias or address")
  .action(async (rawOpts) => {
    const options = z
      .object({
        group: z.string(),
        user: z.string(),
      })
      .parse(rawOpts);
    const config = await readConfig();
    const wallet = new Wallet(config.privateKey);
    const xmtpClient = await Client.create(wallet, { env: "production" });
    const server = createServer({ fromClient: xmtpClient });
    await start({ server });
    const serverClient = createClient({
      usingLocalServer: server,
      forRemoteServerAddress: config.groupServerAddress,
    });
    const group = await resolve({ aliasOrSource: options.group });
    const user = await resolve({ aliasOrSource: options.user });
    const invited = await serverClient({
      channelAddress: group,
      memberAddress: user,
    });
    console.log(JSON.stringify(invited, null, 2));
    stop({ server });
  });
