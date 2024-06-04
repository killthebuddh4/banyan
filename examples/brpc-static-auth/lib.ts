import { z } from "zod";
import { createSpec } from "@killthebuddha/brpc/createSpec.js";
import { createApi } from "@killthebuddha/brpc/createApi.js";
import { config } from "./config.js";

export const spec = createSpec({
  example: {
    input: z.undefined(),
    output: z.string(),
  },
});

export const api = createApi({
  spec,
  api: {
    example: {
      acl: {
        type: "private",
        allow: async ({ context }) => {
          return context.message.senderAddress === config.client.address;
        },
      },
      handler: async ({ context }) => {
        return `Hello, ${context.message.senderAddress}!`;
      },
    },
  },
});
