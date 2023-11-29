import { create as createContext } from "x-rpc/rpc/context/create.js";
import { createRoute } from "x-rpc/rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { deleteChannel } from "./deleteChannel.js";

export const route = createRoute({
  createContext,
  method: "deleteChannel",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    const userDoingTheDeleting = { address: context.message.senderAddress };
    const channelAddress = input.channelAddress;

    return deleteChannel({
      userDoingTheDeleting,
      channelAddress,
      copilotAddress: context.server.client.address,
    });
  },
});
