import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { heartbeat } from "./heartbeat.js";

export const route = createRoute({
  createContext: ({ client, message, request }) => ({
    client,
    message,
    request,
  }),
  method: "heartbeat",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: () => {
    return heartbeat();
  },
  options: {
    mode: "stream",
  },
});
