import { Plugin } from "./Plugin.js";

export const create: ({ address }: { address: string }) => Plugin =
  ({ address }: { address: string }) =>
  ({ event }) => {
    return {
      ...event,
      metadata: {
        ...(event.metadata || {}),
        address,
      },
    };
  };
