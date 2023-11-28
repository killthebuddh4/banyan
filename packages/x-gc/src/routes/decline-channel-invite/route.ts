import { create as createContext } from "x-rpc/rpc/context/create.js";
import { createRoute } from "x-rpc/rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { declineChannelInvite } from "./declineChannelInvite.js";

export const route = createRoute({
  createContext,
  method: "declineChannelInvite",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    const userDoingTheDeclining = { address: context.message.senderAddress };
    const channelAddress = input.channelAddress;

    return declineChannelInvite({
      userDoingTheDeclining,
      channelAddress,
    });
  },
});
