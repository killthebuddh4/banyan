import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { describeGroup } from "./describeGroup.js";

export const route = createRoute({
  createContext: ({ client, message, request }) => ({
    client,
    message,
    request,
  }),
  method: "describeGroup",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    return describeGroup({
      userDoingTheReading: { address: context.message.senderAddress },
      group: input.group,
    });
  },
});
