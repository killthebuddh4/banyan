import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { createRpc } from "@killthebuddha/xm-rpc/api/createRpc.js";
import { getTestServerAddress } from "./lib/getTestServerAddress.js";
import { streamStore } from "@killthebuddha/xm-rpc/stream/streams/streamStore.js";
import { stopStream } from "@killthebuddha/xm-rpc/stream/streams/stopStream.js";

describe("heartbeat route", () => {
  it("should have a heartbeat", async function () {
    this.timeout(10000);

    const client = await Client.create(Wallet.createRandom(), {
      env: "production",
    });

    try {
      const rpcClient = createRpc({
        server: { address: await getTestServerAddress() },
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

      if (response?.result.heartbeat !== true) {
        throw new Error("Heartbeat was not true");
      }
    } finally {
      await stopStream({ store: streamStore, clientAddress: client.address });
    }
  });
});
