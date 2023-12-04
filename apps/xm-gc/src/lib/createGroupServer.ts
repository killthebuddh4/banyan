import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { publishToGroup } from "./publishToGroup.js";
import { create as createServer } from "@killthebuddha/xm-rpc/server/api/create.js";
import { start } from "@killthebuddha/xm-rpc/server/api/start.js";
import { subscribe } from "@killthebuddha/xm-rpc/server/api/subscribe.js";
import { db } from "./db.js";

/* TODO There's no way to restart the group server on reboot because we don't
 * save the keys. */
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

  await start({ server });

  const stream = subscribe({
    toServer: server,
  });

  (async () => {
    for await (const message of stream) {
      if (message.senderAddress === client.address) {
        return;
      }

      if (message.content === undefined) {
        return;
      }

      if (message.content.length === 0) {
        return;
      }

      const members = await db.groupMember.findMany({
        where: {
          group: {
            address: client.address,
          },
        },
        include: {
          user: true,
        },
      });

      const senderIsMember = Boolean(
        members.find((member) => {
          return member.user.address === message.senderAddress;
        }),
      );

      if (!senderIsMember) {
        return;
      }

      publishToGroup({
        fromMember: { address: message.senderAddress },
        group: { address: client.address },
        message: message.content,
      });
    }
  })();

  return {
    client,
    stop: () => stream.return(),
  };
};
