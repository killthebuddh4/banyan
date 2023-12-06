import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { listGroups } from "./listGroups.js";

export const route = createRoute({
  createContext: ({ client, message, request }) => ({
    client,
    message,
    request,
  }),
  method: "listGroups",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context }) => {
    return listGroups({
      userDoingTheListing: { address: context.message.senderAddress },
    });
  },
});
