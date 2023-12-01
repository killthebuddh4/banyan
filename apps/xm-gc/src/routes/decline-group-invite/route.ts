import { create as createContext } from "@killthebuddha/xm-rpc/rpc/context/create.js";
import { createRoute } from "@killthebuddha/xm-rpc/rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { declineInvite } from "./declineInvite.js";

export const route = createRoute({
  createContext,
  method: "declineGroupInvite",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    return declineInvite({
      userDoingTheDeclining: { address: context.message.senderAddress },
      group: input.group,
    });
  },
});
