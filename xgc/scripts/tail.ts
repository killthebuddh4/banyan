import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import chalk from "chalk";
import readline from "readline";
import { sendMessage } from "../xgc/xmtp/sendMessage.js";

const XGC_TAIL_KEY = z.string().parse(process.env.XGC_TAIL_KEY);
const wallet = new Wallet(XGC_TAIL_KEY);
const peerAddress = z.string().parse(process.argv[2]);
const client = await Client.create(wallet, { env: "production" });
const stream = await client.conversations.streamAllMessages();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
  historySize: 0,
});

rl.on("line", async (input) => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  await sendMessage({
    client,
    toAddress: peerAddress,
    content: input,
  });
});

const displayPrompt = () => {
  rl.prompt(true);
};

const log = (message: string) => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  console.log(message);
  displayPrompt();
};

console.log("WELCOME TO THE BANYAN XMTP CLIENT");

displayPrompt();

for await (const message of stream) {
  if (message.senderAddress === client.address) {
    log(chalk.blue(`    ${message.senderAddress}`));
    log(`      ${message.content}`);
  } else {
    log(chalk.green(message.senderAddress));
    log(`${message.content}`);
  }
}
