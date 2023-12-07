import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { acceptInvite } from "./acceptInvite.js";

export const route = createRoute({
  createContext: ({ client, message, request }) => ({
    client,
    message,
    request,
  }),
  method: "acceptGroupInvite",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    return acceptInvite({
      userDoingTheAccepting: { address: context.message.senderAddress },
      group: input.group,
      copilotAddress: context.client.address,
    });
  },
});
