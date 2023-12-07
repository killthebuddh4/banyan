import { z } from "zod";
import { createContext } from "../../lib/createContext.js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { db } from "../../lib/db.js";

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
});
