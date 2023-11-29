import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { create as createServer } from "x-rpc/server/api/create.js";
import { createServer as createRpcServer } from "x-rpc/rpc/api/createServer.js";
import { RpcRoute } from "x-rpc/rpc/RpcRoute.js";
import { readConfig } from "x-core/config/readConfig.js";
import { route as createChannelRoute } from "./routes/create-channel/route.js";
import { route as describeChannelRoute } from "./routes/describe-channel/route.js";
import { route as deleteChannelRoute } from "./routes/delete-channel/route.js";
import { route as listCreatedChannelsRoute } from "./routes/list-created-channels/route.js";
import { route as inviteMemberToChannelRoute } from "./routes/invite-member-to-channel/route.js";
import { route as declineChannelInviteRoute } from "./routes/decline-channel-invite/route.js";
import { route as acceptChannelInviteRoute } from "./routes/accept-channel-invite/route.js";
import { route as removeMemberFromChannelRoute } from "./routes/remove-member-from-channel/route.js";
import { route as heartbeatRoute } from "./routes/heartbeat/route.js";
import { env } from "./options/xmtp/env.js";
import { onAlreadyRunning } from "./options/onAlreadyRunning.js";
import { onStreamBefore } from "./options/onStreamBefore.js";
import { onStreamError } from "./options/onStreamError.js";
import { onStreamSuccess } from "./options/onStreamSuccess.js";
import { onUncaughtHandlerError } from "./options/onUncaughtHandlerError.js";
import { onSubscriberCalled } from "./options/onSubscriberCalled.js";
import { onMessageReceived } from "./options/onMessageReceived.js";
import { onNotStarted } from "./options/onNotStarted.js";
import { onJsonParseError } from "./options/rpc/onJsonParseError.js";
import { onRequestParseError } from "./options/rpc/onRequestParseError.js";
import { onMethodNotFound } from "./options/rpc/onMethodNotFound.js";
import { onInvalidParams } from "./options/rpc/onInvalidParams.js";
import { onServerError } from "./options/rpc/onServerError.js";
import { onHandlerError } from "./options/rpc/onHandlerError.js";
import { onMethodCalled } from "./options/rpc/onMethodCalled.js";

const config = await readConfig({});
const wallet = new Wallet(config.privateKey);
const client = await Client.create(wallet, { env });

const server = createServer({
  usingClient: client,
  options: {
    onAlreadyRunning,
    onStream: {
      before: onStreamBefore,
      success: onStreamSuccess,
      error: onStreamError,
    },
    onUncaughtHandlerError,
    onSubscriberCalled,
    onMessageReceived,
    onNotStarted,
  },
});

const routes = new Map<string, RpcRoute<any, any>>([
  [createChannelRoute.method, createChannelRoute],
  [deleteChannelRoute.method, deleteChannelRoute],
  [describeChannelRoute.method, describeChannelRoute],
  [listCreatedChannelsRoute.method, listCreatedChannelsRoute],
  [acceptChannelInviteRoute.method, acceptChannelInviteRoute],
  [declineChannelInviteRoute.method, declineChannelInviteRoute],
  [inviteMemberToChannelRoute.method, inviteMemberToChannelRoute],
  [removeMemberFromChannelRoute.method, removeMemberFromChannelRoute],
  [heartbeatRoute.method, heartbeatRoute],
]);

const groupServer = createRpcServer({
  usingServer: server,
  withRoutes: routes,
  options: {
    onJsonParseError,
    onRequestParseError,
    onMethodNotFound,
    onInvalidParams,
    onServerError,
    onHandlerError,
    onMethodCalled,
  },
});

groupServer();
