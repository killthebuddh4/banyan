import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { sendMessage } from "xm-lib/sendMessage.js";
import { createStream } from "@killthebuddha/xm-rpc/api/createStream.js";
import { createRouter } from "@killthebuddha/xm-rpc/api/createRouter.js";
import { RpcRoute } from "@killthebuddha/xm-rpc/rpc/RpcRoute.js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
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
import { db } from "./db.js";
import { createContext } from "./createContext.js";

const config = await readConfig({
  overridePath: process.env.XM_VAL_CONFIG_PATH,
});
const wallet = new Wallet(config.privateKey);
const client = await Client.create(wallet, { env });

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

/* TODO stash/recover API. This api is extremely simple except for it wraps the
 * written value in an encrypted envelope. It uses a secondary XMTP identity to
 * encrypt and decrypt the value. */

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
          await db.value.update({
            where: {
              key: input.key,
            },
            data: {
              value: input.value,
            },
          });
        } else {
          await db.value.create({
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
        }

        const subscribers = await db.subscriber.findMany({
          where: {
            value: {
              key: input.key,
            },
          },
          include: {
            user: true,
          },
        });

        for (const subscriber of subscribers) {
          // TODO We need to send a structured message. We also need to make
          // sure to send a deleted message if the value was deleted.
          sendMessage({
            client,
            toAddress: subscriber.user.address,
            content: input.value,
          });
        }

        return {
          ok: true,
          result: {
            key: input.key,
            value: input.value,
          },
        };
      },
    }),
  ],
  [
    "delete",
    createRoute({
      createContext,
      method: "delete",
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

        if (!readerIsOwner) {
          return {
            ok: false,
            result: {
              value: undefined,
            },
          };
        }

        const deleted = await db.value.delete({
          where: {
            key: input.key,
          },
        });

        return {
          ok: true,
          result: {
            value: deleted.value,
          },
        };
      },
    }),
  ],
  [
    "publish",
    createRoute({
      createContext,
      method: "publish",
      inputSchema: z.object({
        key: z.string(),
        reader: z.object({
          address: z.string(),
        }),
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

        if (value.owner.address !== context.message.senderAddress) {
          return {
            ok: false,
            result: {
              value: undefined,
            },
          };
        }

        await db.reader.create({
          data: {
            user: {
              connect: {
                address: input.reader.address,
              },
            },
            value: {
              connect: {
                key: input.key,
              },
            },
          },
        });

        return {
          ok: true,
          result: {
            reader: {
              address: input.reader.address,
            },
          },
        };
      },
    }),
  ],
  [
    "subscribe",
    createRoute({
      createContext,
      method: "subscribe",
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

        const readers = await db.reader.findMany({
          where: {
            value: {
              key: input.key,
            },
          },
          include: {
            user: true,
          },
        });

        const senderIsReader = Boolean(
          readers.find((reader) => {
            return reader.user.address === context.message.senderAddress;
          }),
        );

        if (!senderIsReader) {
          return {
            ok: false,
            result: {
              value: undefined,
            },
          };
        }

        await db.subscriber.create({
          data: {
            user: {
              connect: {
                address: context.message.senderAddress,
              },
            },
            value: {
              connect: {
                key: input.key,
              },
            },
          },
        });

        return {
          ok: true,
          result: {
            subscriber: {
              address: context.message.senderAddress,
            },
          },
        };
      },
    }),
  ],
]);

const valServer = createRouter({
  client,
  routeStore: routes,
  withOptions: {
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

const stream = await createStream({
  client,
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

for await (const message of stream.select({ selector: async () => true })) {
  valServer({ message });
}
