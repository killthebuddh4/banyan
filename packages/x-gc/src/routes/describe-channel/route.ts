import { createRoute } from "x-rpc/rpc/api/createRoute.js";
import { create as createContext } from "x-rpc/rpc/context/create.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { describeChannel } from "./describeChannel.js";

export const route = createRoute({
  createContext,
  method: "describeChannel",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    const userDoingTheReading = { address: context.message.senderAddress };
    const channelAddress = input.channelAddress;

    return describeChannel({
      userDoingTheReading,
      channelAddress,
    });
  },
});
