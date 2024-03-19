import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { createRpc } from "@killthebuddha/xm-rpc/api/createRpc.js";
import { getTestServerAddress } from "./lib/getTestServerAddress.js";
import { Wallet } from "@ethersproject/wallet";
import { streamStore } from "@killthebuddha/xm-rpc/stream/streams/streamStore.js";
import { stopStream } from "@killthebuddha/xm-rpc/stream/streams/stopStream.js";
import crypto from "crypto";

describe("delete route", () => {
  it("should be able to delete a value", async function () {
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

      const deleteRpc = createRpc({
        server: { address: await getTestServerAddress() },
        client,
        forRoute: createRoute({
          createContext: (i) => i,
          method: "delete",
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

      const beforeDelete = await readRpc({ key: data.key });

      if (beforeDelete?.result.value !== data.value) {
        throw new Error("Value was not written");
      }

      await deleteRpc({ key: data.key });

      const afterDelete = await readRpc({ key: data.key });

      if (afterDelete?.result.value !== null) {
        throw new Error("Value was not deleted");
      }
    } finally {
      await stopStream({ store: streamStore, clientAddress: client.address });
    }
  });
});
