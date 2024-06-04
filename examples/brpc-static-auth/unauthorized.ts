import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { createClient } from "@killthebuddha/brpc/createClient.js";
import { spec } from "./lib.js";
import { config } from "./config.js";

const unauthorized = async () => {
  const wallet = Wallet.createRandom();
  const xmtp = await Client.create(wallet);
  const { client, close } = await createClient({
    xmtp,
    spec,
    address: config.server.address,
  });
  const response = await client.example({ input: undefined });
  console.log(response);
  close();
};

unauthorized();
