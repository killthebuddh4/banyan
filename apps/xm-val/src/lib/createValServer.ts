import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { create as createServer } from "@killthebuddha/xm-rpc/server/api/create.js";
import { start } from "@killthebuddha/xm-rpc/server/api/start.js";
import { subscribe } from "@killthebuddha/xm-rpc/server/api/subscribe.js";
import { db } from "./db.js";

export const createGroupServer = async ({
  ownerAddress,
  name,
  description,
}: {
  ownerAddress: string;
  name: string;
  description: string;
}) => {
  const wallet = Wallet.createRandom();
  const client = await Client.create(wallet, { env: "production" });
  const server = createServer({
    usingClient: client,
  });
  const stop = await start({ server });

  subscribe({
    toServer: server,
    subscriber: {
      metadata: {
        id: "group server",
      },
      filter: async ({ message }) => {
        if (message.senderAddress === client.address) {
          return false;
        }

        if (message.content === undefined) {
          return false;
        }

        if (message.content.length === 0) {
          return false;
        }

        return true;
      },
      handler: async ({ message }) => {
        // TODO
      },
    },
  });

  return {
    client,
    stop,
  };
};
