import { z } from "zod";
import { Command } from "commander";
import { createClient as createChannelCreateClient } from "x-core/actions/create-channel/createClient.js";
import { createClient as deleteChannelCreateClient } from "x-core/actions/delete-channel/createClient.js";
import { createClient as listCreatedChannelsCreateClient } from "x-core/actions/list-created-channels/createClient.js";
import { createClient as describeChannelCreateClient } from "x-core/actions/describe-channel/createClient.js";
import { createClient as inviteMemberToChannelCreateClient } from "x-core/actions/invite-member-to-channel/createClient.js";
import { createClient as acceptChannelInviteCreateClient } from "x-core/actions/accept-channel-invite/createClient.js";
import { createClient as declineChannelInviteCreateClient } from "x-core/actions/decline-channel-invite/createClient.js";
import { createClient as removeMemberFromChannelCreateClient } from "x-core/actions/remove-member-from-channel/createClient.js";
import { createServer } from "x-core/xmtp/server/create.js";
import { start } from "x-core/xmtp/server/start.js";
import { stop } from "x-core/xmtp/server/stop.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { getDefaultConfigPath } from "./config/getDefaultConfigPath.js";
import { readConfig } from "./config/readConfig.js";
import { setActiveConfigPath } from "./config/setActiveConfigPath.js";
import { writeAlias } from "./writeAlias.js";
import { resolveAlias } from "./resolveAlias.js";

/* CREATE CLIENT */

const program = new Command().option(
  "-c, --config <config>",
  "Path to config file",
  getDefaultConfigPath(),
);
const group = new Command("group");

/* CREATE GROUP */

const createGroup = new Command("create")
  .description("Create a new group")
  .requiredOption("-a, --alias <alias>", "Group alias")
  .requiredOption("-d, --description <description>", "Group description")
  .action(async (rawOpts) => {
    const options = z
      .object({
        config: z.string(),
        alias: z.string(),
        description: z.string(),
      })
      .parse({ ...program.opts(), ...rawOpts });
    setActiveConfigPath({ activeConfigPath: options.config });
    const config = await readConfig();
    const wallet = new Wallet(config.privateKey);
    const xmtpClient = await Client.create(wallet, { env: "production" });
    const server = createServer({ fromClient: xmtpClient });
    await start({ server });

    const client = createChannelCreateClient({
      usingLocalServer: server,
      forRemoteServerAddress: config.remoteServerAddress,
    });

    const created = await client({
      name: options.alias,
      description: options.description,
    });

    if (!created.ok) {
      // do nothing
    } else {
      await writeAlias({
        alias: options.alias,
        source: created.result.createdChannelAddress,
      });
    }

    console.log(JSON.stringify(created, null, 2));
    stop({ server });
  });

/* DESCRIBE GROUP */

const describeGroup = new Command("describe")
  .description("Describe a group")
  .requiredOption("-g, --group <group>", "Group alias or address")
  .action(async (rawOpts) => {
    const options = z
      .object({
        config: z.string(),
        group: z.string(),
      })
      .parse({ ...program.opts(), ...rawOpts });
    setActiveConfigPath({ activeConfigPath: options.config });
    const config = await readConfig();
    const wallet = new Wallet(config.privateKey);
    const xmtpClient = await Client.create(wallet, { env: "production" });
    const server = createServer({ fromClient: xmtpClient });
    await start({ server });
    const serverClient = describeChannelCreateClient({
      usingLocalServer: server,
      forRemoteServerAddress: config.remoteServerAddress,
    });
    const group = await resolveAlias({ alias: options.group });
    const described = await serverClient({
      channelAddress: group,
    });
    console.log(JSON.stringify(described, null, 2));
    stop({ server });
  });

// /* DELETE GROUP */

// const deleteGroup = new Command("delete")
//   .description("Delete a group")
//   .requiredOption("-g, --group <group>", "Group alias or address")
//   .action(async (rawOpts) => {
//     const options = z
//       .object({
//         group: z.string(),
//       })
//       .parse(rawOpts);

//     await start({ server });

//     const client = deleteChannelCreateClient({
//       usingLocalServer: server,
//       forRemoteServerAddress: CONFIG.remoteServerAddress,
//     });

//     const deleted = await client({
//       channelAddress: options.group,
//     });

//     console.log(JSON.stringify(deleted, null, 2));
//     stop({ server });
//   });

// const listGroups = group
//   .command("list")
//   .description("List groups")
//   .action(async () => {
//     await start({ server });

//     const client = listCreatedChannelsCreateClient({
//       usingLocalServer: server,
//       forRemoteServerAddress: CONFIG.remoteServerAddress,
//     });

//     const listed = await client({});

//     console.log(JSON.stringify(listed, null, 2));
//     stop({ server });
//   });

// const inviteUser = group
//   .command("invite")
//   .description("invite a member to a group")
//   .requiredOption("-g, --group <group>", "Group alias or address")
//   .requiredOption("-u, --user <user>", "User alias or address")
//   .action(async (rawOpts) => {
//     const options = z
//       .object({
//         group: z.string(),
//         user: z.string(),
//       })
//       .parse(rawOpts);

//     await start({ server });

//     const client = inviteMemberToChannelCreateClient({
//       usingLocalServer: server,
//       forRemoteServerAddress: CONFIG.remoteServerAddress,
//     });

//     const invited = await client({
//       channelAddress: options.group,
//       memberAddress: options.user,
//     });

//     console.log(JSON.stringify(invited, null, 2));
//     stop({ server });
//   });

// const acceptInvite = group
//   .command("accept")
//   .description("accept a group invite")
//   .requiredOption("-g, --group <group>", "Group alias or address")
//   .action(async (rawOpts) => {
//     const options = z
//       .object({
//         group: z.string(),
//       })
//       .parse(rawOpts);

//     await start({ server });

//     const client = acceptChannelInviteCreateClient({
//       usingLocalServer: server,
//       forRemoteServerAddress: CONFIG.remoteServerAddress,
//     });

//     const accepted = await client({
//       channelAddress: options.group,
//     });

//     console.log(JSON.stringify(accepted, null, 2));
//     stop({ server });
//   });

// const declineInvite = group
//   .command("decline")
//   .description("decline a group invite")
//   .requiredOption("-g, --group <group>", "Group alias or address")
//   .action(async (rawOpts) => {
//     const options = z
//       .object({
//         group: z.string(),
//       })
//       .parse(rawOpts);

//     await start({ server });

//     const client = declineChannelInviteCreateClient({
//       usingLocalServer: server,
//       forRemoteServerAddress: CONFIG.remoteServerAddress,
//     });

//     const declined = await client({
//       channelAddress: options.group,
//     });

//     console.log(JSON.stringify(declined, null, 2));
//     stop({ server });
//   });

// const removeUser = group
//   .command("remove")
//   .description("remove a member from a group")
//   .requiredOption("-g, --group <group>", "Group alias or address")
//   .requiredOption("-u, --user <user>", "User alias or address")
//   .action(async (rawOpts) => {
//     const options = z
//       .object({
//         group: z.string(),
//         user: z.string(),
//       })
//       .parse(rawOpts);

//     await start({ server });

//     const client = removeMemberFromChannelCreateClient({
//       usingLocalServer: server,
//       forRemoteServerAddress: CONFIG.remoteServerAddress,
//     });

//     const removed = await client({
//       channelAddress: options.group,
//       memberAddress: options.user,
//     });

//     console.log(JSON.stringify(removed, null, 2));
//     stop({ server });
//   });

// const leaveGroup = group
//   .command("leave")
//   .description("leave a group")
//   .requiredOption("-g, --group <group>", "Group alias or address")
//   .action(async (rawOpts) => {
//     const options = z
//       .object({
//         group: z.string(),
//       })
//       .parse(rawOpts);

//     await start({ server });

//     const client = removeMemberFromChannelCreateClient({
//       usingLocalServer: server,
//       forRemoteServerAddress: CONFIG.remoteServerAddress,
//     });

//     const removed = await client({
//       channelAddress: options.group,
//       memberAddress: server.client.address,
//     });

//     console.log(JSON.stringify(removed, null, 2));
//     stop({ server });
//   });

// /* ALIAS */

// const alias = program.command("alias");

// const addAlias = alias
//   .command("add")
//   .description("Set an alias for an address")
//   .requiredOption("--address <address>", "User or group address")
//   .requiredOption("-a, --alias", "The alias to set");

// const removeAlias = alias
//   .command("remove")
//   .description("Remove an alias")
//   .requiredOption("-a, --alias", "The alias to remove");

/* WIRE IT ALL UP */

group.addCommand(createGroup);
// group.addCommand(deleteGroup);
group.addCommand(describeGroup);
// group.addCommand(listGroups);
// group.addCommand(inviteUser);
// group.addCommand(removeUser);
// group.addCommand(acceptInvite);
// group.addCommand(declineInvite);
// group.addCommand(leaveGroup);
program.addCommand(group);

/* RUN IT */

program.parse();
