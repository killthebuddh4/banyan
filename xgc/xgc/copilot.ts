import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { createServer } from "./xmtp/createServer.js";
import { dispatch } from "./copilot/server/dispatch.js";

const XGC_PRIVATE_KEY = z.string().parse(process.env.XGC_PRIVATE_KEY);

const wallet = new Wallet(XGC_PRIVATE_KEY);
const client = await Client.create(wallet, { env: "production" });

createServer({
  fromClient: client,
  withHandlers: [dispatch],
});
