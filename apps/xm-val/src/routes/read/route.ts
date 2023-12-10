import { z } from "zod";
import { createContext } from "../../lib/createContext.js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { db } from "../../lib/db.js";
import { RpcError } from "@killthebuddha/xm-rpc/rpc/errors/RpcError.js";
import { errors } from "@killthebuddha/xm-rpc/rpc/errors/errors.js";

export const route = createRoute({
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
      return { value: null };
    }

    const reader = { address: context.message.senderAddress };

    const readerIsOwner = value.owner.address === reader.address;

    const readerIsReader = Boolean(
      value.readers.find((r) => {
        return reader.address === r.user.address;
      }),
    );

    if (!readerIsOwner && !readerIsReader) {
      throw new RpcError(
        `User ${reader.address} is not allowed to read key ${input.key}`,
        errors.FORBIDDEN.code,
      );
    }

    return { key: input.key, value: value.value };
  },
});
