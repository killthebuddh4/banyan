import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { createRpc } from "@killthebuddha/xm-rpc/api/createRpc.js";
import { getTestServerAddress } from "./lib/getTestServerAddress.js";
import { Wallet } from "@ethersproject/wallet";
import crypto from "crypto";

import { streamStore } from "@killthebuddha/xm-rpc/stream/streams/streamStore.js";
import { stopStream } from "@killthebuddha/xm-rpc/stream/streams/stopStream.js";
describe("read route", () => {
  it("should be able to read a value", async function () {
    this.timeout(10000);

    const client = await Client.create(Wallet.createRandom(), {
      env: "production",
    });

    try {
      const writeRpc = createRpc({
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

      const readRpc = createRpc({
        server: { address: await getTestServerAddress() },
        client,
        forRoute: createRoute({
          createContext: (i) => i,
          method: "read",
          inputSchema: z.object({
            key: z.string(),
          }),
          outputSchema: z.any(),
          handler: async () => "hey",
        }),
      });

      const data = {
        key: "test key " + crypto.randomUUID(),
        value: "test value" + crypto.randomUUID(),
      };

      await writeRpc(data);

      const response = await readRpc({ key: data.key });

      if (response?.result.value !== data.value) {
        throw new Error("Value was not written");
      }
    } finally {
      await stopStream({ store: streamStore, clientAddress: client.address });
    }
  });
});
