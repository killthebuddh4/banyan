import * as api from "./api.js";
import { createServer } from "@killthebuddha/brpc/createServer.js";
import { writeFile } from "fs/promises";

const server = await createServer({
  api,
  options: {
    onMessage: ({ message }) => {
      console.log(`RECEIVED MESSAGE FROM: ${message.senderAddress}`);
      console.log(`RECEIVED MESSAGE CONTENT: ${message.content}`);
      console.log(
        `RECEIVED MESSAGE CID: ${message.conversation.context?.conversationId}`,
      );
    },
    onResponseSent: ({ message }) => {
      console.log(`SENT MESSAGE TO: ${message.conversation.peerAddress}`);
      console.log(`SENT MESSAGE CONTENT: ${message.content}`);
      console.log(
        `SENT MESSAGE CID: ${message.conversation.context?.conversationId}`,
      );
    },
  },
});
await writeFile("/tmp/.brpc", server.address);
await server.start();
await new Promise(() => {});
