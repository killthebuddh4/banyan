import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { create as createServer } from "@killthebuddha/xm-rpc/server/api/create.js";
import { createServer as createRpcServer } from "@killthebuddha/xm-rpc/rpc/api/createServer.js";
import { RpcRoute } from "@killthebuddha/xm-rpc/rpc/RpcRoute.js";
import { readConfig } from "xm-lib/config/readConfig.js";
import { route as createGroupRoute } from "./routes/create-group/route.js";
import { route as describeGroupRoute } from "./routes/describe-group/route.js";
import { route as deleteGroupRoute } from "./routes/delete-group/route.js";
import { route as listGroupsRoute } from "./routes/list-groups/route.js";
import { route as inviteToGroupRoute } from "./routes/invite-to-group/route.js";
import { route as declineGroupInviteRoute } from "./routes/decline-group-invite/route.js";
import { route as acceptGroupInviteRoute } from "./routes/accept-group-invite/route.js";
import { route as deleteMemberRoute } from "./routes/delete-member/route.js";
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
import { useConversationId } from "./options/useConversationId.js";
import { onResponse } from "./options/onResponse.js";

const config = await readConfig({
  overridePath: process.env.XGC_CONFIG_PATH,
});
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
  [createGroupRoute.method, createGroupRoute],
  [deleteGroupRoute.method, deleteGroupRoute],
  [describeGroupRoute.method, describeGroupRoute],
  [listGroupsRoute.method, listGroupsRoute],
  [acceptGroupInviteRoute.method, acceptGroupInviteRoute],
  [declineGroupInviteRoute.method, declineGroupInviteRoute],
  [inviteToGroupRoute.method, inviteToGroupRoute],
  [deleteMemberRoute.method, deleteMemberRoute],
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
    useConversationId,
    onResponse,
  },
});

groupServer();
