import { z } from "zod";
import { createContext } from "../../lib/createContext.js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { db } from "../../lib/db.js";

export const route = createRoute({
  createContext,
  method: "recall",
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

    if (value.owner.address !== context.message.senderAddress) {
      return {
        ok: false,
        result: {
          value: undefined,
        },
      };
    }

    await db.reader.deleteMany({
      where: {
        value: {
          key: input.key,
        },
      },
    });

    return {
      ok: true,
      result: {
        recalled: true,
      },
    };
  },
});
