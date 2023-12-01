import { create as createContext } from "@killthebuddha/xm-rpc/rpc/context/create.js";
import { createRoute } from "@killthebuddha/xm-rpc/rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { deleteGroup } from "./deleteGroup.js";

export const route = createRoute({
  createContext,
  method: "deleteChannel",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    return deleteGroup({
      owner: { address: context.server.client.address },
      group: { address: input.group.address },
      copilotAddress: context.server.client.address,
    });
  },
});
