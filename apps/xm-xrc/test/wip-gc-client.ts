import { createClient } from "@killthebuddha/xm-rpc/rpc/api/createClient.js";
import { create as createServer } from "@killthebuddha/xm-rpc/server/api/create.js";
import { start } from "@killthebuddha/xm-rpc/server/api/start.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { route as createChannelRoute } from "../src/routes/create-group/route.js";
import { route as describeChannelRoute } from "../src/routes/describe-group/route.js";
import { route as deleteChannelRoute } from "../src/routes/delete-group/route.js";
import { route as listCreatedChannelsRoute } from "../src/routes/list-groups/route.js";
import { route as inviteMemberToChannelRoute } from "../src/routes/invite-to-group/route.js";
import { route as declineChannelInviteRoute } from "../src/routes/decline-group-invite/route.js";
import { route as acceptChannelInviteRoute } from "../src/routes/accept-group-invite/route.js";
import { route as removeMemberFromChannelRoute } from "../src/routes/delete-member/route.js";

const wallet = Wallet.createRandom();
const client = await Client.create(wallet, { env: "production" });

const server = createServer({
  usingClient: client,
  options: {
    onAlreadyRunning: () => console.log("Already running"),
    onStream: {
      before: () => console.log("RAW :: Before stream"),
      success: () => console.log("RAW :: Started stream"),
      error: () => console.log("RAW :: Error"),
    },
    onUncaughtHandlerError: () => console.log("RAW :: Uncaught handler error"),
    onSubscriberCalled: () => console.log("RAW :: Subscriber called"),
    onMessageReceived: ({ message }) =>
      console.log("RAW :: message received", message.content),
    onNotStarted: () => console.log("RAW :: Not started"),
  },
});

const stop = await start({ server });

export const createChannelClient = createClient({
  remoteServerAddress: "0xbB5697194fa6E94c6B2c9d460b695fb5cf731eAB",
  usingLocalServer: server,
  forRoute: createChannelRoute,
});

export const describeChannelClient = createClient({
  remoteServerAddress: "0xbB5697194fa6E94c6B2c9d460b695fb5cf731eAB",
  usingLocalServer: server,
  forRoute: describeChannelRoute,
});

export const deleteChannelClient = createClient({
  remoteServerAddress: "0xbB5697194fa6E94c6B2c9d460b695fb5cf731eAB",
  usingLocalServer: server,
  forRoute: deleteChannelRoute,
});

export const listCreatedChannelsClient = createClient({
  remoteServerAddress: "0xbB5697194fa6E94c6B2c9d460b695fb5cf731eAB",
  usingLocalServer: server,
  forRoute: listCreatedChannelsRoute,
});

export const inviteMemberToChannelClient = createClient({
  usingLocalServer: server,
  remoteServerAddress: "0xbB5697194fa6E94c6B2c9d460b695fb5cf731eAB",
  forRoute: inviteMemberToChannelRoute,
});

export const declineChannelInviteClient = createClient({
  remoteServerAddress: "0xbB5697194fa6E94c6B2c9d460b695fb5cf731eAB",
  usingLocalServer: server,
  forRoute: declineChannelInviteRoute,
});

export const acceptChannelInviteClient = createClient({
  remoteServerAddress: "0xbB5697194fa6E94c6B2c9d460b695fb5cf731eAB",
  usingLocalServer: server,
  forRoute: acceptChannelInviteRoute,
});

export const removeMemberFromChannelClient = createClient({
  remoteServerAddress: "0xbB5697194fa6E94c6B2c9d460b695fb5cf731eAB",
  usingLocalServer: server,
  forRoute: removeMemberFromChannelRoute,
});
