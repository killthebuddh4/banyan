import { z } from "zod";
import { createClient } from "./rpc/api/createClient.js";
import { createRpcRoute } from "./rpc/createRpcRoute.js";
import { RpcRoute } from "./rpc/RpcRoute.js";
import { create as createServer } from "./server/api/create.js";
import { start } from "./server/api/start.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";

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
    onMessageReceived: () => console.log("RAW :: message received"),
    onNotStarted: () => console.log("RAW :: Not started"),
  },
});

const stop = await start({ server });

const sumRoute = createRpcRoute({
  address: "0xbB5697194fa6E94c6B2c9d460b695fb5cf731eAB",
  inputSchema: z.object({
    a: z.number(),
    b: z.number(),
  }),
  outputSchema: z.number(),
  method: "sum",
  handler: async ({ a, b }) => a + b,
});

const divideRoute = createRpcRoute({
  address: "0xbB5697194fa6E94c6B2c9d460b695fb5cf731eAB",
  inputSchema: z.object({
    num: z.number(),
    denom: z.number(),
  }),
  outputSchema: z.number(),
  method: "divide",
  handler: async ({ num, denom }) => num / denom,
});

const sumClient = createClient({
  usingLocalServer: server,
  forRoute: sumRoute,
});

const divideClient = createClient({
  usingLocalServer: server,
  forRoute: divideRoute,
});

const sum = await sumClient({ a: 1, b: 2 });

const divide = await divideClient({ num: 1, denom: 2 });

console.log("sum", sum);

console.log("divide", divide);

if (typeof stop === "function") {
  stop();
}
