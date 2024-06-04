import { z } from "zod";
import { Wallet } from "@ethersproject/wallet";
import { createSpec } from "./createSpec.js";
import { createClient } from "./createClient.js";
import { createServer } from "./createServer.js";
import { createApi } from "./createApi.js";
import { Client } from "@xmtp/xmtp-js";

const clientWallet = Wallet.createRandom();
const authorizedWallet = Wallet.createRandom();
const serverWallet = Wallet.createRandom();

const CLEANUP: Array<() => void> = [];

describe("Brpc", () => {
  afterEach(() => {
    for (const cleanup of CLEANUP) {
      cleanup();
    }
  });

  it("should work", async function () {
    this.timeout(15000);

    const spec = createSpec({
      add: {
        input: z.object({
          a: z.number(),
          b: z.number(),
        }),
        output: z.number(),
      },
      concat: {
        input: z.object({
          a: z.string(),
          b: z.string(),
        }),
        output: z.string(),
      },
    });

    const api = createApi({
      spec,
      api: {
        add: {
          acl: { type: "public" },
          inputSchema: spec.add.input,
          handler: async ({ context, input }) => {
            return input.a + input.b;
          },
        },
        concat: {
          acl: { type: "public" },
          inputSchema: spec.concat.input,
          handler: async ({ context, input }) => {
            return input.a + input.b;
          },
        },
      },
    });

    const server = await createServer({
      xmtp: await Client.create(serverWallet),
      api,
    });

    const { client, close } = await createClient({
      xmtp: await Client.create(clientWallet),
      address: serverWallet.address,
      spec,
    });

    CLEANUP.push(close);
    CLEANUP.push(server.close);

    const addResult = await client.add({ input: { a: 1, b: 2 } });

    if (!addResult.ok) {
      console.error(addResult);
      throw new Error("add failed");
    }

    if (addResult.data !== 3) {
      console.error(addResult);
      throw new Error("add returned wrong result");
    }

    const concatResult = await client.concat({
      input: { a: "hello", b: "world" },
    });

    if (!concatResult.ok) {
      throw new Error("concat failed");
    }

    if (concatResult.data !== "helloworld") {
      throw new Error("concat returned wrong result");
    }

    console.log("ADD RESULT IS", addResult.data);
    console.log("CONCAT RESULT IS", concatResult.data);
  });

  it("should not allow unknown procedures", async function () {
    this.timeout(15000);

    const spec = createSpec({
      proc: {
        input: z.object({
          a: z.string(),
          b: z.string(),
        }),
        output: z.string(),
      },
    });

    const api = createApi({
      spec,
      api: {
        notProc: {
          inputSchema: spec.proc.input,
          handler: async ({ context, input }: any) => {
            return input.a + input.b;
          },
        },
      },
    } as any);

    const server = await createServer({
      xmtp: await Client.create(serverWallet),
      api,
    });

    const { client, close } = await createClient({
      xmtp: await Client.create(clientWallet),
      address: serverWallet.address,
      spec,
    });

    CLEANUP.push(close);
    CLEANUP.push(server.close);

    const result = await client.proc({ input: { a: "hey", b: "there" } });

    if (result.ok) {
      throw new Error("proc should have failed");
    }

    if (result.code !== "UNKNOWN_PROCEDURE") {
      throw new Error("proc should have failed with UNKNOWN_PROCEDURE");
    }

    console.log("RESULT IS", result);
  });

  it("should not allow public access to private procedures", async function () {
    this.timeout(15000);

    const spec = createSpec({
      stealTreasure: {
        input: z.object({
          amount: z.number(),
        }),
        output: z.number(),
      },
    });

    const api = createApi({
      spec,
      api: {
        stealTreasure: {
          acl: { type: "private", allow: async () => false },
          inputSchema: spec.stealTreasure.input,
          handler: async ({ context, input }) => {
            return input.amount;
          },
        },
      },
    });

    const server = await createServer({
      xmtp: await Client.create(serverWallet),
      api,
    });

    const { client, close } = await createClient({
      xmtp: await Client.create(clientWallet),
      address: serverWallet.address,
      spec,
    });

    CLEANUP.push(close);
    CLEANUP.push(server.close);

    const result = await client.stealTreasure({ input: { amount: 100 } });

    if (result.ok) {
      throw new Error("stealTreasure should have failed");
    }

    if (result.code !== "UNAUTHORIZED") {
      throw new Error("stealTreasure should have failed with UNAUTHORIZED");
    }

    console.log("RESULT IS", result);
  });
  it("should allow authorized access to private procedures", async function () {
    this.timeout(15000);

    const spec = createSpec({
      stealTreasure: {
        input: z.object({
          amount: z.number(),
        }),
        output: z.number(),
      },
    });

    const api = createApi({
      spec,
      api: {
        stealTreasure: {
          acl: {
            type: "private",
            allow: async ({ context }) => {
              return context.message.senderAddress === authorizedWallet.address;
            },
          },
          inputSchema: spec.stealTreasure.input,
          handler: async ({ context, input }) => {
            return input.amount;
          },
        },
      },
    });

    const server = await createServer({
      xmtp: await Client.create(serverWallet),
      api,
    });

    const unauthorizedClient = await createClient({
      xmtp: await Client.create(clientWallet),
      address: serverWallet.address,
      spec,
    });

    const authorizedClient = await createClient({
      xmtp: await Client.create(authorizedWallet),
      address: serverWallet.address,
      spec,
    });

    CLEANUP.push(authorizedClient.close);
    CLEANUP.push(unauthorizedClient.close);
    CLEANUP.push(server.close);

    const unauthorizedResult = await unauthorizedClient.client.stealTreasure({
      input: { amount: 100 },
    });

    if (unauthorizedResult.ok) {
      throw new Error(
        "stealTreasure should have failed for unauthorized client",
      );
    }

    const authorizedResult = await authorizedClient.client.stealTreasure({
      input: { amount: 100 },
    });

    if (!authorizedResult.ok) {
      throw new Error(
        "stealTreasure should have succeeded for authorized client",
      );
    }

    if (authorizedResult.data !== 100) {
      throw new Error("stealTreasure returned wrong result");
    }

    console.log("AUTHORIZED RESULT IS", authorizedResult);
    console.log("AUTHORIZED RESULT IS", unauthorizedResult);
  });
});
