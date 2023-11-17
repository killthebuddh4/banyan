import { create as serverCreate } from "../../xgc/xmtp/server/create.js";
import { start } from "../../xgc/xmtp/server/start.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";

const wallet = Wallet.createRandom();
const client = await Client.create(wallet, { env: "production" });
const server = serverCreate({ fromClient: client });
await start({ server });
export const serverForBob = server;
