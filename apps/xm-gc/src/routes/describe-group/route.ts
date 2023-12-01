import { createRoute } from "@killthebuddha/xm-rpc/rpc/api/createRoute.js";
import { create as createContext } from "@killthebuddha/xm-rpc/rpc/context/create.js";
import { inputSchema } from "./inputSchema.js";
import { outputSchema } from "./outputSchema.js";
import { describeGroup } from "./describeGroup.js";

export const route = createRoute({
  createContext,
  method: "describeGroup",
  inputSchema: inputSchema.shape.arguments,
  outputSchema: outputSchema,
  handler: ({ context, input }) => {
    return describeGroup({
      userDoingTheReading: { address: context.message.senderAddress },
      group: input.group,
    });
  },
});
