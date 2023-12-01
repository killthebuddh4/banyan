import { create as createContext } from "@killthebuddha/xm-rpc/rpc/context/create.js";
import { createRoute } from "@killthebuddha/xm-rpc/rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { deleteMember } from "./deleteMember.js";

export const route = createRoute({
  createContext,
  method: "deleteMember",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    return deleteMember({
      userDoingTheRemoving: { address: context.message.senderAddress },
      group: input.group,
      userToRemove: { address: input.member.address },
      copilotClient: context.server.client,
    });
  },
});
