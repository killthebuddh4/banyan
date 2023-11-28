import { createRoute } from "x-rpc/rpc/api/createRoute.js";
import { create as createContext } from "x-rpc/rpc/context/create.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { createChannel } from "./createChannel.js";

export const route = createRoute({
  createContext,
  method: "createChannel",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    const userDoingTheCreating = { address: context.message.senderAddress };

    return createChannel({
      userDoingTheCreating,
      name: input.name,
      description: input.description,
    });
  },
});