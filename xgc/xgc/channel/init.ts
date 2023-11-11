import { Channel } from "./Channel.js";
import { User } from "./User.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { publishToChannel } from "./publishToChannel.js";

export const init = async ({
  ownerAddress,
  name,
  description,
}: {
  ownerAddress: string;
  name: string;
  description: string;
}): Promise<Channel> => {
  const wallet = Wallet.createRandom();
  const client = await Client.create(wallet, { env: "production" });
  const stream = await client.conversations.streamAllMessages();
  const owner = { address: ownerAddress };
  const members: User[] = [owner];

  const channel = {
    address: client.address,
    name,
    invitations: [],
    owner,
    description,
    members,
    stream,
    client,
  };

  (async () => {
    for await (const message of stream) {
      try {
        if (message.senderAddress === client.address) {
          continue;
        }

        if (message.content === undefined) {
          continue;
        }

        publishToChannel({
          fromUser: { address: message.senderAddress },
          channel,
          message: message.content,
        });
      } catch (err) {
        console.error(
          "GOT AN ERROR IN CHANNEL MESSAGE HANDLER",
          "FROM",
          message.senderAddress,
          "CONTENT",
          message.content,
          err,
        );
      }
    }
  })();

  return channel;
};
