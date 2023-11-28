import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { create as createServer } from "x-rpc/server/api/create.js";
import { createServer as createRpcServer } from "x-rpc/rpc/api/createServer.js";
import { RpcRoute } from "x-rpc/rpc/RpcRoute.js";
import { setActiveConfigPath } from "x-core/config/setActiveConfigPath.js";
import { getDefaultConfigPath } from "x-core/config/getDefaultConfigPath.js";
import { readConfig } from "x-core/config/readConfig.js";
import { route as createChannelRoute } from "./routes/create-channel/route.js";
import { route as declineChannelInviteRoute } from "./routes/decline-channel-invite/route.js";
import { route as describeChannelRoute } from "./routes/describe-channel/route.js";

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
    onMessageReceived: ({ message }) => {
      if (message.senderAddress === client.address) {
        // do nothing
        console.log("MESSAGE SENT", message.content);
      } else {
        console.log("MESSAGE RECEIVED", message.content);
      }
    },
    onNotStarted: () => console.log("RAW :: Not started"),
  },
});

const routes = new Map<string, RpcRoute<any, any>>([
  ["createChannel", createChannelRoute],
  ["declineChannelInvite", declineChannelInviteRoute],
  ["describeChannel", describeChannelRoute],
]);

const groupServer = createRpcServer({
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

groupServer();
