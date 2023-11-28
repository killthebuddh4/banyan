import { createRoute } from "x-rpc/rpc/api/createRoute.js";
import { create as createContext } from "x-rpc/rpc/context/create.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { acceptChannelInvite } from "./acceptChannelInvite.js";

export const route = createRoute({
  createContext,
  method: "acceptChannelInvite",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    const userDoingTheAccepting = { address: context.message.senderAddress };
    const channelAddress = input.channelAddress;
    const serverAddress = context.server.client.address;

    return acceptChannelInvite({
      userDoingTheAccepting,
      channelAddress,
      copilotAddress: serverAddress,
    });
  },
});
