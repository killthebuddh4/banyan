import { z } from "zod";
import { createContext } from "../../lib/createContext.js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { db } from "../../lib/db.js";
import { RpcError } from "@killthebuddha/xm-rpc/rpc/errors/RpcError.js";
import { errors } from "@killthebuddha/xm-rpc/rpc/errors/errors.js";

export const route = createRoute({
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
      throw new RpcError(
        `Value with key ${input.key} does not exist`,
        errors.NOT_FOUND.code,
      );
    }

    if (value.owner.address !== context.message.senderAddress) {
      throw new RpcError(
        `User ${context.message.senderAddress} is not allowed to publish key ${input.key}`,
        errors.FORBIDDEN.code,
      );
    }

    await db.reader.create({
      data: {
        user: {
          connectOrCreate: {
            create: {
              address: input.reader.address,
            },
            where: {
              address: input.reader.address,
            },
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
});
