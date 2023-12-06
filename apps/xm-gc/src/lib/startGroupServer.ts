import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { publishToGroup } from "./publishToGroup.js";
import { createStream } from "@killthebuddha/xm-rpc/api/createStream.js";
import { createGroupServerSelector } from "./createGroupServerSelector.js";

/* TODO There's no way to restart the group server on reboot because we don't
 * save the keys. */
export const startGroupServer = async ({
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

  const stream = await createStream({ client });

  const selector = createGroupServerSelector({
    group: { address: client.address },
  });

  (async () => {
    for await (const message of stream.select({ selector })) {
      publishToGroup({
        fromMember: { address: message.senderAddress },
        group: { address: client.address },
        message: message.content,
      });
    }
  })();

  return {
    client,
    stop: stream.stop,
  };
};
