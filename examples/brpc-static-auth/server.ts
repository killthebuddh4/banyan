import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { createServer } from "@killthebuddha/brpc/createServer.js";
import { api } from "./lib.js";
import { config } from "./config.js";

const server = async () => {
  const wallet = new Wallet(config.server.key);
  const xmtp = await Client.create(wallet);
  await createServer({ xmtp, api });
  console.log(`Listening on address: ${wallet.address}...`);
};

server();
