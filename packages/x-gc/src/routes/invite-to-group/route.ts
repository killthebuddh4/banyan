import { create as createContext } from "x-rpc/rpc/context/create.js";
import { createRoute } from "x-rpc/rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { inviteToGroup } from "./inviteToGroup.js";

export const route = createRoute({
  createContext,
  method: "inviteToGroup",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    return inviteToGroup({
      userDoingTheInviting: { address: context.message.senderAddress },
      group: { address: input.groupAddress },
      userToInvite: { address: input.memberAddress },
      copilotClient: context.server.client,
    });
  },
});
