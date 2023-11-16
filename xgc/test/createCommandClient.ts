import { z } from "zod";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { MessageHandler } from "../xgc/xmtp/MessageHandler.js";

const doCreateChannel = async ({
  usingClient,
  name,
  description,
}: {
  usingClient: Client;
  name: string;
  description: string;
}) => {
  let resolver: (message: DecodedMessage) => void;

  const stream = await usingClient.conversations.streamAllMessages();

  const responseSchema = z.string();

  const responsePromise = new Promise<DecodedMessage>((resolve) => {
    resolver = resolve;
  });

  // Not sure why we need an assignment here, why we can't use an IIFE.
  const x = async () => {
    for await (const message of stream) {
      const response = responseSchema.safeParse(message.content);
      if (!response.success) {
        continue;
      } else {
        if (resolver === undefined) {
          throw new Error("resolver is undefined");
        } else {
          resolver(message);
        }
      }
    }
  };

  x();

  const message = await responsePromise;

  return message.content;
};

const usingClient = await Client.create(Wallet.createRandom(), {
  // TODO use dev
  env: "production",
});

console.log("usingClient.address", usingClient.address);

const x = await doCreateChannel({
  usingClient,
  name: "test channel",
  description: "test channel description",
});

console.log("x", x);
