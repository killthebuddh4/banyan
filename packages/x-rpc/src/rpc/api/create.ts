import { RpcOptions } from "../RpcOptions.js";
import { Options } from "../../server/Options.js";
import { Server } from "../../server/Server.js";
import { subscribe } from "../../server/api/subscribe.js";
import { start } from "../../server/api/start.js";
import { RpcRoute } from "../RpcRoute.js";
import { createRpcRouter } from "../createRpcRouter.js";
import crypto from "crypto";

export const create = ({
  usingServer,
  withRoutes,
  options,
}: {
  usingServer: Server;
  withRoutes: Map<string, RpcRoute>;
  options?: RpcOptions;
}) => {
  subscribe({
    toServer: usingServer,
    subscriber: {
      metadata: {
        id: crypto.randomUUID(),
      },
      filter: async ({ message }) => {
        return message.senderAddress !== usingServer.client.address;
      },
      handler: createRpcRouter({
        routeStore: withRoutes,
        withOptions: options,
      }),
    },
  });

  return () => start({ server: usingServer });
};
