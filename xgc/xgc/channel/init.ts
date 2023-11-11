import { Channel } from "./Channel.js";
import { User } from "./User.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";

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

  (async () => {
    for await (const message of stream) {
      try {
        if (message.senderAddress === client.address) {
          continue;
        }

        for (const member of members) {
          if (message.senderAddress === member.address) {
            continue;
          } else {
            const conversation = await client.conversations.newConversation(
              member.address,
            );
            conversation.send(`${message.senderAddress}: ${message.content}`);
          }
        }
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

  const channel = {
    address: client.address,
    name,
    invitations: [],
    owner,
    description,
    members: [owner],
    stream,
    client,
  };

  return channel;
};
