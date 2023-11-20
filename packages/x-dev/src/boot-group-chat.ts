import { Wallet } from "@ethersproject/wallet";
import { writeFile } from "fs/promises";
import { Client } from "@xmtp/xmtp-js";
import { createClient as createChannelCreateClient } from "x-core/actions/create-channel/createClient.js";
import { createClient as describeChannelCreateClient } from "x-core/actions/describe-channel/createClient.js";
import { createClient as acceptChannelInviteCreateClient } from "x-core/actions/accept-channel-invite/createClient.js";
import { createClient as inviteMemberToChannelCreateClient } from "x-core/actions/invite-member-to-channel/createClient.js";
import { createServer } from "x-core/xmtp/server/create.js";
import { start } from "x-core/xmtp/server/start.js";
import { stop } from "x-core/xmtp/server/stop.js";

const CONFIG = {
  remoteServerAddress: "0xD7C0462bFc1f9cB88e31748b0E3Db018821Ec193",
};

/* ALICE */

console.log("CREATING ALICE");

const aliceWallet = Wallet.createRandom();
await writeFile(
  "/tmp/alice-wallet.json",
  JSON.stringify({
    address: aliceWallet.address,
    privateKey: aliceWallet.privateKey,
  }),
);
const aliceClient = await Client.create(aliceWallet, { env: "production" });
const aliceServer = createServer({ fromClient: aliceClient });
await start({ server: aliceServer });

const acccAlice = acceptChannelInviteCreateClient({
  usingLocalServer: aliceServer,
  forRemoteServerAddress: CONFIG.remoteServerAddress,
});

/* BOB */

console.log("CREATING BOB");

const bobWallet = Wallet.createRandom();
await writeFile(
  "/tmp/bob-wallet.json",
  JSON.stringify({
    address: bobWallet.address,
    privateKey: bobWallet.privateKey,
  }),
);
const bobClient = await Client.create(bobWallet, { env: "production" });
const bobServer = createServer({ fromClient: bobClient });
await start({ server: bobServer });

const acccBob = acceptChannelInviteCreateClient({
  usingLocalServer: bobServer,
  forRemoteServerAddress: CONFIG.remoteServerAddress,
});

/* CHARLIE */

console.log("CREATING CHARLIE");

const charlieWallet = Wallet.createRandom();
await writeFile(
  "/tmp/charlie-wallet.json",
  JSON.stringify({
    address: charlieWallet.address,
    privateKey: charlieWallet.privateKey,
  }),
);
const charlieClient = await Client.create(charlieWallet, { env: "production" });
const charlieServer = createServer({ fromClient: charlieClient });
await start({ server: charlieServer });

const acccCharlie = acceptChannelInviteCreateClient({
  usingLocalServer: charlieServer,
  forRemoteServerAddress: CONFIG.remoteServerAddress,
});

/* ADMIN */

console.log("CREATING ADMIN");

const adminWallet = Wallet.createRandom();
await writeFile(
  "/tmp/admin-wallet.json",
  JSON.stringify({
    address: adminWallet.address,
    privateKey: adminWallet.privateKey,
  }),
);
const adminClient = await Client.create(adminWallet, { env: "production" });
const adminServer = createServer({ fromClient: adminClient });
await start({ server: adminServer });

const cccc = createChannelCreateClient({
  usingLocalServer: adminServer,
  forRemoteServerAddress: CONFIG.remoteServerAddress,
});

const iccc = inviteMemberToChannelCreateClient({
  usingLocalServer: adminServer,
  forRemoteServerAddress: CONFIG.remoteServerAddress,
});

const dccc = describeChannelCreateClient({
  usingLocalServer: adminServer,
  forRemoteServerAddress: CONFIG.remoteServerAddress,
});

/* Crreate, invite, and accept */

console.log("CREATING CHANNEL");

const created = await cccc({
  name: "test channel",
  description: "test channel description",
});

if (!created.ok) {
  console.log("failed to create channel");
  process.exit(1);
}

console.log("INVITING ALICE");

await iccc({
  channelAddress: created.result.createdChannelAddress,
  memberAddress: aliceServer.client.address,
});

console.log("INVITING BOB");

await iccc({
  channelAddress: created.result.createdChannelAddress,
  memberAddress: bobServer.client.address,
});

console.log("INVITING CHARLIE");

await iccc({
  channelAddress: created.result.createdChannelAddress,
  memberAddress: charlieServer.client.address,
});

console.log("ACCEPTING ALICE");

await acccAlice({
  channelAddress: created.result.createdChannelAddress,
});

console.log("ACCEPTING BOB");

await acccBob({
  channelAddress: created.result.createdChannelAddress,
});

console.log("ACCEPTING CHARLIE");

await acccCharlie({
  channelAddress: created.result.createdChannelAddress,
});

console.log("DESCRIBING CHANNEL");

const described = await dccc({
  channelAddress: created.result.createdChannelAddress,
});

await writeFile("/tmp/channel.json", JSON.stringify(described, null, 2));

console.log(JSON.stringify(described, null, 2));

stop({ server: aliceServer });
stop({ server: bobServer });
stop({ server: charlieServer });
stop({ server: adminServer });
