import { create as createContext } from "x-rpc/rpc/context/create.js";
import { createRoute } from "x-rpc/rpc/api/createRoute.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { listCreatedChannels } from "./listCreatedChannels.js";

export const route = createRoute({
  createContext,
  method: "listCreatedChannels",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context }) => {
    const userDoingTheListing = { address: context.message.senderAddress };

    return listCreatedChannels({
      userDoingTheListing,
      creatorAddress: userDoingTheListing.address,
    });
  },
});
