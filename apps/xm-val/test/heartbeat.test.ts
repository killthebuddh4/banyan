import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { createRpc } from "@killthebuddha/xm-rpc/api/createRpc.js";
import { readConfig } from "xm-lib/config/readConfig.js";

const SERVER_ADDRESS = await (async () => {
  const config = await readConfig({
    overridePath: process.env.XM_VAL_CONFIG_PATH,
  });
  return new Wallet(config.privateKey).address;
})();

describe("heartbeat route", () => {
  it.only("should have a heartbeat", async function () {
    this.timeout(10000);

    const client = await Client.create(Wallet.createRandom(), {
      env: "production",
    });

    console.log("XM_VAL_SERVER_ADDRESS", SERVER_ADDRESS);

    const rpcClient = createRpc({
      server: { address: SERVER_ADDRESS },
      client,
      forRoute: createRoute({
        createContext: (i) => i,
        method: "heartbeat",
        inputSchema: z.unknown(),
        outputSchema: z.unknown(),
        handler: async () => undefined,
      }),
    });

    const response = await rpcClient({ input: null });

    console.log(response);
  });
});
