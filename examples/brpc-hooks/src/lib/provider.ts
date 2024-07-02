import { useConsumerStore } from "@/hooks/useConsumerStore";
import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";

const attach = createProcedure({
  auth: async () => true,
  handler: async (_, ctx) => {
    const consumers = new Set([
      ...useConsumerStore.getState().consumers,
      ctx.message.senderAddress,
    ]);
    useConsumerStore.setState({ consumers: Array.from(consumers) });
    return { attached: true };
  },
});

const detach = createProcedure({
  auth: async () => true,
  handler: async (_, ctx) => {
    const consumers = new Set(useConsumerStore.getState().consumers);
    consumers.delete(ctx.message.senderAddress);
    useConsumerStore.setState({ consumers: Array.from(consumers) });
    return { detached: true };
  },
});

export const provider = { attach, detach };
