import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";

export const server = async ({ privateKey }: { privateKey: string }) => {
  const wallet = new Wallet(privateKey);
  const client = await Client.create(wallet, { env: "production" });
  const stream = await client.conversations.streamAllMessages();

  (async () => {
    for await (const message of stream) {
      if (message.senderAddress === client.address) {
        continue;
      }

      try {
        // TODO
      } catch (err) {
        console.log("SENDER ADDRESS", message.senderAddress);
        console.error("GOT AN ERROR IN MESSAGE HANDLING", err);
      }
    }
  })();

  return { client };
};
