import { create as createContext } from "x-rpc/rpc/context/create.js";
import { createRoute } from "x-rpc/rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { removeMemberFromChannel } from "./removeMemberFromChannel.js";

export const route = createRoute({
  createContext,
  method: "removeMemberFromChannel",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    const userDoingTheRemoving = { address: context.message.senderAddress };
    const channelAddress = input.channelAddress;
    const userToRemove = { address: input.memberAddress };

    return removeMemberFromChannel({
      userDoingTheRemoving,
      channelAddress,
      userToRemove,
      copilotClient: context.server.client,
    });
  },
});
