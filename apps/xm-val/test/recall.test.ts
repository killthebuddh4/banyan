import { z } from "zod";
import { Client } from "@xmtp/xmtp-js";
import { createRoute } from "@killthebuddha/xm-rpc/api/createRoute.js";
import { createRpc } from "@killthebuddha/xm-rpc/api/createRpc.js";
import { getTestServerAddress } from "./lib/getTestServerAddress.js";
import { Wallet } from "@ethersproject/wallet";
import { errors } from "@killthebuddha/xm-rpc/rpc/errors/errors.js";
import crypto from "crypto";
import { streamStore } from "@killthebuddha/xm-rpc/stream/streams/streamStore.js";
import { stopStream } from "@killthebuddha/xm-rpc/stream/streams/stopStream.js";

describe("recall route", () => {
  it("should be able to recall a value", async function () {
    this.timeout(10000);

    const owner = await Client.create(Wallet.createRandom(), {
      env: "production",
    });

    const reader = await Client.create(Wallet.createRandom(), {
      env: "production",
    });

    try {
      const writeRpc = createRpc({
        server: { address: await getTestServerAddress() },
        client: owner,
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
        client: reader,
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

      const publishRpc = createRpc({
        server: { address: await getTestServerAddress() },
        client: owner,
        forRoute: createRoute({
          createContext: (i) => i,
          method: "publish",
          inputSchema: z.object({
            key: z.string(),
            reader: z.object({
              address: z.string(),
            }),
          }),
          outputSchema: z.any(),
          handler: async () => "hey",
        }),
      });

      const recallRpc = createRpc({
        server: { address: await getTestServerAddress() },
        client: owner,
        forRoute: createRoute({
          createContext: (i) => i,
          method: "recall",
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

      const beforePublish = await readRpc({ key: data.key });

      const isForbiddenSchema = z.object({
        error: z.object({
          code: z.literal(errors.FORBIDDEN.code),
        }),
      });

      if (!isForbiddenSchema.safeParse(beforePublish).success) {
        throw new Error("Server should have thrown a forbidden error.");
      }

      await publishRpc({
        key: data.key,
        reader: {
          address: reader.address,
        },
      });

      const afterPublish = await readRpc({ key: data.key });

      if (afterPublish?.result.value !== data.value) {
        throw new Error("Could not read value after publish");
      }

      await recallRpc({ key: data.key });

      const afterRecall = await readRpc({ key: data.key });

      if (!isForbiddenSchema.safeParse(afterRecall).success) {
        throw new Error("Server should have thrown a forbidden error.");
      }
    } finally {
      await stopStream({ store: streamStore, clientAddress: owner.address });
      await stopStream({ store: streamStore, clientAddress: reader.address });
    }
  });
});
