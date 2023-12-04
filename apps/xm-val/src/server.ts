import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { create as createServer } from "@killthebuddha/xm-rpc/server/api/create.js";
import { createServer as createRpcServer } from "@killthebuddha/xm-rpc/rpc/api/createServer.js";
import { RpcRoute } from "@killthebuddha/xm-rpc/rpc/RpcRoute.js";
import { createRoute } from "@killthebuddha/xm-rpc/rpc/api/createRoute.js";
import { create as createContext } from "@killthebuddha/xm-rpc/rpc/context/create.js";
import { readConfig } from "xm-lib/config/readConfig.js";
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
import { db } from "./lib/db.js";

const config = await readConfig({
  overridePath: process.env.XM_VAL_CONFIG_PATH,
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

const existingOwner = await db.user.findUnique({
  where: {
    address: process.env.XGC_VAL_OWNER_ADDRESS,
  },
});

if (existingOwner === null) {
  await db.user.create({
    data: {
      address: process.env.XGC_VAL_OWNER_ADDRESS as string,
    },
  });
}

const routes = new Map<string, RpcRoute<any, any>>([
  [
    "read",
    createRoute({
      createContext,
      method: "read",
      inputSchema: z.object({
        key: z.string(),
      }),
      outputSchema: z.unknown(),
      handler: async ({ context, input }) => {
        const value = await db.value.findUnique({
          where: {
            key: input.key,
          },
          include: {
            owner: true,
            readers: {
              include: {
                user: true,
              },
            },
          },
        });

        if (value === null) {
          return {
            ok: false,
            result: {
              value: undefined,
            },
          };
        }

        const reader = { address: context.message.senderAddress };

        const readerIsOwner = value.owner.address === reader.address;

        const readerIsReader = Boolean(
          value.readers.find((r) => {
            return reader.address === r.user.address;
          }),
        );

        if (!readerIsOwner && !readerIsReader) {
          return {
            ok: false,
            result: {
              value: undefined,
            },
          };
        }

        return {
          ok: true,
          result: {
            value: value.value,
          },
        };
      },
    }),
  ],
  [
    "write",
    createRoute({
      createContext,
      method: "write",
      inputSchema: z.object({
        key: z.string(),
        value: z.string(),
      }),
      outputSchema: z.unknown(),
      handler: async ({ context, input }) => {
        const writer = { address: context.message.senderAddress };

        if (writer.address !== process.env.XGC_VAL_OWNER_ADDRESS) {
          return {
            ok: false,
            result: {},
          };
        }

        const existing = await db.value.findUnique({
          where: {
            key: input.key,
          },
        });

        if (existing !== null) {
          const written = await db.value.update({
            where: {
              key: input.key,
            },
            data: {
              value: input.value,
            },
          });

          return {
            ok: true,
            result: {
              key: written.key,
              value: written.value,
            },
          };
        } else {
          const written = await db.value.create({
            data: {
              key: input.key,
              value: input.value,
              owner: {
                connect: {
                  address: writer.address,
                },
              },
            },
          });

          return {
            ok: true,
            result: {
              key: written.key,
              value: written.value,
            },
          };
        }
      },
    }),
  ],
  [
    "delete",
    createRoute({
      createContext,
      method: "delete",
      inputSchema: z.unknown(),
      outputSchema: z.unknown(),
      handler: async () => undefined,
    }),
  ],
  [
    "subscribe",
    createRoute({
      createContext,
      method: "subscribe",
      inputSchema: z.unknown(),
      outputSchema: z.unknown(),
      handler: async () => undefined,
    }),
  ],
]);

const valServer = createRpcServer({
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

valServer();
