import { create as createContext } from "x-rpc/rpc/context/create.js";
import { createRoute } from "x-rpc/rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { inviteMemberToChannel } from "./inviteMemberToChannel.js";

export const route = createRoute({
  createContext,
  method: "inviteMemberToChannel",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    const userDoingTheInviting = { address: context.message.senderAddress };
    const channelAddress = input.channelAddress;
    const userToInvite = { address: input.memberAddress };

    return inviteMemberToChannel({
      userDoingTheInviting,
      channelAddress,
      userToInvite,
      copilotClient: context.server.client,
    });
  },
});
