import { createRoute } from "x-rpc/rpc/api/createRoute.js";
import { create as createContext } from "x-rpc/rpc/context/create.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { heartbeat } from "./heartbeat.js";

export const route = createRoute({
  createContext,
  method: "heartbeat",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: () => {
    return heartbeat();
  },
});
