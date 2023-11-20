import { createServer as serverCreate } from "../../src/xmtp/server/create.js";
import { start } from "../../src/xmtp/server/start.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";

const wallet = Wallet.createRandom();
const client = await Client.create(wallet, { env: "production" });
const server = serverCreate({ fromClient: client });
await start({ server });
export const serverForAdmin = server;
