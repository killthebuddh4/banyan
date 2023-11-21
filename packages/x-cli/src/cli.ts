import { z } from "zod";
import { Command } from "commander";
import { createClient as createChannelCreateClient } from "x-core/actions/create-channel/createClient.js";
import { createClient as describeChannelCreateClient } from "x-core/actions/describe-channel/createClient.js";
import { createClient as deleteChannelCreateClient } from "x-core/actions/delete-channel/createClient.js";
import { createServer } from "x-core/xmtp/server/create.js";
import { start } from "x-core/xmtp/server/start.js";
import { stop } from "x-core/xmtp/server/stop.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";

const CONFIG = {
  privateKey: z.string().parse(process.env.XGC_PRIVATE_KEY),
  remoteServerAddress: "0xD7C0462bFc1f9cB88e31748b0E3Db018821Ec193",
};

/* CREATE CLIENT */

const wallet = new Wallet(CONFIG.privateKey);
const client = await Client.create(wallet, { env: "production" });
const server = createServer({ fromClient: client });

const program = new Command();
const group = new Command("group");

/* CREATE GROUP */

const createGroup = new Command("create")
  .description("Create a new group")
  .requiredOption("-a, --alias <alias>", "Group alias")
  .requiredOption("-d, --description <description>", "Group description")
  .action(async (rawOpts) => {
    const options = z
      .object({
        alias: z.string(),
        description: z.string(),
      })
      .parse(rawOpts);

    await start({ server });

    const client = createChannelCreateClient({
      usingLocalServer: server,
      forRemoteServerAddress: CONFIG.remoteServerAddress,
    });

    const created = await client({
      name: options.alias,
      description: options.description,
    });

    console.log(JSON.stringify(created, null, 2));
    stop({ server });
  });

/* DELETE GROUP */
const deleteGroup = new Command("delete")
  .description("Delete a group")
  .requiredOption("-g, --group <group>", "Group alias or address")
  .action(async (rawOpts) => {
    const options = z
      .object({
        group: z.string(),
      })
      .parse(rawOpts);

    await start({ server });

    const client = deleteChannelCreateClient({
      usingLocalServer: server,
      forRemoteServerAddress: CONFIG.remoteServerAddress,
    });

    const deleted = await client({
      channelAddress: options.group,
    });

    console.log(JSON.stringify(deleted, null, 2));
    stop({ server });
  });

group.addCommand(createGroup);
group.addCommand(deleteGroup);
program.addCommand(group);

const listGroups = group
  .command("list")
  .description("List groups")
  .option("-m, --mine", "List only groups I own");

const inviteUser = group
  .command("invite")
  .description("invite a member to a group")
  .requiredOption("-g, --group <group>", "Group alias or address")
  .requiredOption("-u, --user <user>", "User alias or address");

const removeUser = group
  .command("remove")
  .description("remove a member from a group")
  .requiredOption("-g, --group <group>", "Group alias or address")
  .requiredOption("-u, --user <user>", "User alias or address");

const acceptInvite = group
  .command("accept")
  .description("accept a group invite")
  .requiredOption("-g, --group <group>", "Group alias or address");

const declineInvite = group
  .command("decline")
  .description("decline a group invite")
  .requiredOption("-g, --group <group>", "Group alias or address");

const leaveGroup = group
  .command("leave")
  .description("leave a group")
  .requiredOption("-g, --group <group>", "Group alias or address");

/* ALIAS */

const alias = program.command("alias");

const addAlias = alias
  .command("add")
  .description("Set an alias for an address")
  .requiredOption("--address <address>", "User or group address")
  .requiredOption("-a, --alias", "The alias to set");

const removeAlias = alias
  .command("remove")
  .description("Remove an alias")
  .requiredOption("-a, --alias", "The alias to remove");

// .description("Create a channel")
// .requiredOption("-n, --name <name>", "Channel name")
// .requiredOption("-d, --description <description>", "Channel description")
// .action(async (options) => {
//   await start({ server });

//   const client = createChannelCreateClient({
//     usingLocalServer: server,
//     forRemoteServerAddress: CONFIG.remoteServerAddress,
//   });

//   const created = await client({
//     name: options.name,
//     description: options.description,
//   });

//   console.log(created);
//   stop({ server });
// });

program.parse();
