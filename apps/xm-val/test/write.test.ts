import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { createRpc } from "@killthebuddha/xm-rpc/api/createRpc.js";
import { getTestServerAddress } from "./lib/getTestServerAddress.js";
import { getTesterWallet } from "./lib/getTesterWallet.js";

describe("write route", () => {
  it("should be able to write a value", async function () {
    this.timeout(10000);

    const client = await Client.create(await getTesterWallet(), {
      env: "production",
    });

    const rpcClient = createRpc({
      server: { address: await getTestServerAddress() },
      client,
      forRoute: createRoute({
        createContext: (i) => i,
        method: "write",
        inputSchema: z.object({
          key: z.string(),
          value: z.string(),
        }),
        outputSchema: z.any(),
        handler: async () => "hey",
      }),
    });

    const response = await rpcClient({
      key: "test key",
      value: "test value",
    });

    console.log(response);
  });
});
