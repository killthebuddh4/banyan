import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { createGroup } from "./createGroup.js";

export const route = createRoute({
  createContext: ({ client, message, request }) => ({
    client,
    message,
    request,
  }),
  method: inputSchema.shape.name.parse("createGroup"),
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    return createGroup({
      userDoingTheCreating: { address: context.message.senderAddress },
      name: input.name,
      description: input.description,
    });
  },
});
