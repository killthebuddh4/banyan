import { Command } from "commander";
// TODO I think we need to update the API to show channels you don't own but are in.
import { createClient } from "x-core/actions/list-created-channels/createClient.js";
import { createServer } from "x-core/xmtp/server/create.js";
import { start } from "x-core/xmtp/server/start.js";
import { stop } from "x-core/xmtp/server/stop.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { readConfig } from "../../../config/readConfig.js";

export const list = new Command("list")
  // TODO List groups you are a member of.
  .description("List groups you have created.")
  .action(async () => {
    const config = await readConfig();
    const wallet = new Wallet(config.privateKey);
    const xmtpClient = await Client.create(wallet, { env: "production" });
    const server = createServer({ fromClient: xmtpClient });
    await start({ server });
    const serverClient = createClient({
      usingLocalServer: server,
      forRemoteServerAddress: config.remoteServerAddress,
    });
    const groups = await serverClient({});
    console.log(JSON.stringify(groups, null, 2));
    stop({ server });
  });
