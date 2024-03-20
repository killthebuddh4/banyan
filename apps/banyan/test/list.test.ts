import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { createRpc } from "@killthebuddha/xm-rpc/api/createRpc.js";
import { getTestServerAddress } from "./lib/getTestServerAddress.js";
import crypto from "crypto";
import { streamStore } from "@killthebuddha/xm-rpc/stream/streams/streamStore.js";
import { stopStream } from "@killthebuddha/xm-rpc/stream/streams/stopStream.js";

describe("list route", () => {
  it("should be able to list all keys", async function () {
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

      const listRpc = createRpc({
        server: { address: await getTestServerAddress() },
        client,
        forRoute: createRoute({
          createContext: (i) => i,
          method: "list",
          inputSchema: z.unknown(),
          outputSchema: z.unknown(),
          handler: async () => "hey",
        }),
      });

      const data = [
        {
          key: "test key " + crypto.randomUUID(),
          value: "test value" + crypto.randomUUID(),
        },
        {
          key: "test key " + crypto.randomUUID(),
          value: "test value" + crypto.randomUUID(),
        },
        {
          key: "test key " + crypto.randomUUID(),
          value: "test value" + crypto.randomUUID(),
        },
        {
          key: "test key " + crypto.randomUUID(),
          value: "test value" + crypto.randomUUID(),
        },
        {
          key: "test key " + crypto.randomUUID(),
          value: "test value" + crypto.randomUUID(),
        },
        {
          key: "test key " + crypto.randomUUID(),
          value: "test value" + crypto.randomUUID(),
        },
        {
          key: "test key " + crypto.randomUUID(),
          value: "test value" + crypto.randomUUID(),
        },
        {
          key: "test key " + crypto.randomUUID(),
          value: "test value" + crypto.randomUUID(),
        },
        {
          key: "test key " + crypto.randomUUID(),
          value: "test value" + crypto.randomUUID(),
        },
      ];

      for (const d of data) {
        await writeRpc(d);
      }

      const response = await listRpc({});

      const parsed = z
        .object({
          result: z.array(
            z.object({
              key: z.string(),
            }),
          ),
        })
        .parse(response);

      if (!data.every((p) => parsed.result.some((d) => d.key === p.key))) {
        throw new Error("List did not return all keys");
      }

      if (parsed.result.length !== data.length) {
        console.log(parsed);
        throw new Error("List returned keys that were not written");
      }
    } finally {
      await stopStream({ store: streamStore, clientAddress: client.address });
    }
  });
});
