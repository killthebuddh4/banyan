import { z } from "zod";
import { createContext } from "../../lib/createContext.js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";

export const route = createRoute({
  createContext,
  method: "list",
  inputSchema: z.unknown(),
  outputSchema: z.object({
    ok: z.literal(true),
    result: z.object({
      heartbeat: z.literal(true),
    }),
  }),
  handler: async () => {
    return {
      ok: true,
      result: { heartbeat: true },
    } as const;
  },
});
