import { z } from "zod";
import { createContext } from "../../lib/createContext.js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";

export const route = createRoute({
  createContext,
  method: "heartbeat",
  inputSchema: z.unknown(),
  outputSchema: z.object({
    heartbeat: z.literal(true),
  }),
  handler: async () => {
    return { heartbeat: true } as const;
  },
});
