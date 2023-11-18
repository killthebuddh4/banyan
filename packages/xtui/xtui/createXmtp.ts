import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";

type MH = ({ message }: { message: DecodedMessage }) => void;

export const createXmtp = async ({ pk, peer }: { pk: string, peer: string }) => {
  const wallet = new Wallet(pk);
  const client = await Client.create(wallet, { env: "production" });
  const stream = await client.conversations.streamAllMessages();
  const handlers: MH[] = [];
  const conversation = await client.conversations.newConversation(peer);

  (async () => {
    for await (const message of stream) {
      for (const handler of handlers) {
        handler({ message });
      }
    }
  })();

  const publish = ({ content }: { content: string }) => {
    return conversation.send(content);
  }

  const subscribe = ({ handler }: { handler: MH }) => {
    handlers.push(handler);
  }

  return { client, subscribe, publish };
}