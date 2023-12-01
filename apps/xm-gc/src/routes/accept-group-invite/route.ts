import { createRoute } from "@killthebuddha/xm-rpc/rpc/api/createRoute.js";
import { create as createContext } from "@killthebuddha/xm-rpc/rpc/context/create.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { acceptInvite } from "./acceptInvite.js";

export const route = createRoute({
  createContext,
  method: "acceptGroupInvite",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    return acceptInvite({
      userDoingTheAccepting: { address: context.message.senderAddress },
      group: input.group,
      copilotAddress: context.server.client.address,
    });
  },
});
