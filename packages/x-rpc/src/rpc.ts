import { z } from "zod";
import { create } from "./rpc/api/create.js";
import { RpcRoute } from "./rpc/RpcRoute.js";
import { create as createServer } from "./server/api/create.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { setActiveConfigPath } from "x-core/config/setActiveConfigPath.js";
import { getDefaultConfigPath } from "x-core/config/getDefaultConfigPath.js";
import { readConfig } from "x-core/config/readConfig.js";

setActiveConfigPath({ activeConfigPath: getDefaultConfigPath() });
const config = await readConfig();
const wallet = new Wallet(config.privateKey);
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

const routes = new Map<string, RpcRoute>();

routes.set("sum", {
  inputSchema: z.object({
    a: z.number(),
    b: z.number(),
  }),
  outputSchema: z.number(),
  method: "sum",
  handler: async ({ a, b }) => a + b,
});

routes.set("divide", {
  inputSchema: z.object({
    num: z.number(),
    denom: z.number(),
  }),
  outputSchema: z.number(),
  method: "divide",
  handler: async ({ num, denom }) => num / denom,
});

const rpc = create({
  usingServer: server,
  withRoutes: routes,
  options: {
    onJsonParseError: () => console.log("RPC :: JSON parse error"),
    onRequestParseError: () => console.log("RPC :: Request parse error"),
    onMethodNotFound: () => console.log("RPC :: Method not found"),
    onInvalidParams: () => console.log("RPC :: Invalid params"),
    onServerError: () => console.log("RPC :: Server error"),
    onHandlerError: () => console.log("RPC :: Handler error"),
    onMethodCalled: () => console.log("RPC :: Method called"),
  },
});

rpc();
