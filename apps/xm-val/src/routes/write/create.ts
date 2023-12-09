import { z } from "zod";
import { createContext } from "../../lib/createContext.js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { db } from "../../lib/db.js";
import { sendMessage } from "xm-lib/util/sendMessage.js";
import { Client } from "@xmtp/xmtp-js";

export const create = ({ client }: { client: Client }) =>
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

      const listeners = await db.listener.findMany({
        where: {
          value: {
            key: input.key,
          },
        },
        include: {
          user: true,
        },
      });

      for (const listener of listeners) {
        // TODO We need to send a structured message. We also need to make
        // sure to send a deleted message if the value was deleted.
        sendMessage({
          client,
          toAddress: listener.user.address,
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
  });
