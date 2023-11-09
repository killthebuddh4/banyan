import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import * as Handlers from "./handlers.js";
import * as Channel from "./channel.js";
import * as Lib from "./lib.js";

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
        const { functionName, args } = Lib.jsonStringSchema
          .pipe(Handlers.rpcSchema)
          .parse(message.content);

        switch (functionName) {
          case "connect": {
            const response = Handlers.connectHandler(args);
            message.conversation.send(
              Channel.serializeChannel({
                channel: response.channel,
              }),
            );
            break;
          }
          case "publish": {
            const response = Handlers.publishHandler(args);
            message.conversation.send(
              Channel.serializeChannelEvent({ event: response.event }),
            );
            break;
          }
          case "subscribe": {
            const response = Handlers.subscribeHandler(args);
            message.conversation.send(
              Channel.serializeChannel({
                channel: response.channel,
              }),
            );
            break;
          }
          case "sync": {
            const response = Handlers.syncHandler(args);
            message.conversation.send(
              Channel.serializeChannel({
                channel: response.channel,
              }),
            );
            break;
          }
          case "stats": {
            const response = Handlers.statsHandler(args);
            message.conversation.send(JSON.stringify(response));
            break;
          }
          default:
            throw new Error(`unknown function ${functionName}`);
        }
      } catch (err) {
        console.log("SENDER ADDRESS", message.senderAddress);
        console.error("GOT AN ERROR IN MESSAGE HANDLING", err);
      }
    }
  })();

  return { client };
};
