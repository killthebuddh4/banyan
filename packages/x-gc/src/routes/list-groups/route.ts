import { create as createContext } from "x-rpc/rpc/context/create.js";
import { createRoute } from "x-rpc/rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { listGroups } from "./listGroups.js";

export const route = createRoute({
  createContext,
  method: "listGroups",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context }) => {
    return listGroups({
      userDoingTheListing: { address: context.message.senderAddress },
    });
  },
});
