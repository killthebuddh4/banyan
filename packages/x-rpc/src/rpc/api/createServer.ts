import { RpcOptions } from "../RpcOptions.js";
import { Server } from "../../server/Server.js";
import { subscribe } from "../../server/api/subscribe.js";
import { start } from "../../server/api/start.js";
import { RpcRoute } from "../RpcRoute.js";
import { createRpcRouter } from "../createRpcRouter.js";
import crypto from "crypto";

export const createServer = ({
  usingServer,
  withRoutes,
  options,
}: {
  usingServer: Server;
  withRoutes: Map<string, RpcRoute<any, any>>;
  options?: RpcOptions;
}) => {
  subscribe({
    toServer: usingServer,
    subscriber: {
      metadata: {
        id: crypto.randomUUID(),
      },
      filter: async ({ message }) => {
        if (options?.useConversationId) {
          const conversationId = message.conversation.context?.conversationId;

          if (conversationId === undefined) {
            return false;
          }

          if (!conversationId.startsWith("xmtrpc")) {
            return false;
          }
        }

        return message.senderAddress !== usingServer.client.address;
      },
      handler: createRpcRouter({
        onServer: usingServer,
        routeStore: withRoutes,
        withOptions: options,
      }),
    },
  });

  return () => start({ server: usingServer });
};
