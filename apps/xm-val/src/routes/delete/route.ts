import { z } from "zod";
import { createContext } from "../../lib/createContext.js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { db } from "../../lib/db.js";

export const route = createRoute({
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
});
