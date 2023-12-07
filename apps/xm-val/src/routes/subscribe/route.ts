import { z } from "zod";
import { createContext } from "../../lib/createContext.js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { db } from "../../lib/db.js";

export const route = createRoute({
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
});
