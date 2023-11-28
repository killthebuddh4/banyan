import { z } from "zod";
import { createClient } from "x-rpc/rpc/api/createClient.js";
import { create as createServer } from "x-rpc/server/api/create.js";
import { start } from "x-rpc/server/api/start.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { route as createChannelRoute } from "./routes/create-channel/route.js";
import { route as describeChannelRoute } from "./routes/describe-channel/route.js";

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

const createChannelClient = createClient({
  usingLocalServer: server,
  remoteServerAddress: "0xbB5697194fa6E94c6B2c9d460b695fb5cf731eAB",
  forRoute: createChannelRoute,
});

const describeChannelClient = createClient({
  usingLocalServer: server,
  remoteServerAddress: "0xbB5697194fa6E94c6B2c9d460b695fb5cf731eAB",
  forRoute: describeChannelRoute,
});

const created = await createChannelClient({
  name: "My channel",
  description: "My channel description",
});

console.log("CREATED ", JSON.stringify(created, null, 2));

const described = await describeChannelClient({
  channelAddress: created.result.createdChannelAddress,
});

console.log("DESCRIBED ", JSON.stringify(described, null, 2));

if (typeof stop === "function") {
  stop();
}
