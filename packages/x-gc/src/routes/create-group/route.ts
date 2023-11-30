import { createRoute } from "x-rpc/rpc/api/createRoute.js";
import { create as createContext } from "x-rpc/rpc/context/create.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { createGroup } from "./createGroup.js";

export const route = createRoute({
  createContext,
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
