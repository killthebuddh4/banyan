import { z } from "zod";
import { createContext } from "../../lib/createContext.js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { db } from "../../lib/db.js";

export const route = createRoute({
  createContext,
  method: "list",
  inputSchema: z.unknown(),
  outputSchema: z.unknown(),
  handler: async ({ context, input }) => {
    const keys = await db.value.findMany({
      where: {
        OR: [
          {
            readers: {
              some: {
                user: {
                  address: context.message.senderAddress,
                },
              },
            },
          },
          {
            owner: {
              address: context.message.senderAddress,
            },
          },
        ],
      },
      select: {
        key: true,
      },
    });

    return {
      ok: true,
      result: { keys },
    };
  },
});
