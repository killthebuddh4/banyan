import { z } from "zod";
import { Wallet } from "@ethersproject/wallet";
import { createClient } from "./createClient.js";
import { createServer } from "./createServer.js";
import { createProcedure } from "./createProcedure.js";
import { Client } from "@xmtp/xmtp-js";

const clientWallet = Wallet.createRandom();
const authorizedWallet = Wallet.createRandom();
const serverWallet = Wallet.createRandom();

const CLEANUP: Array<() => void> = [];

const add = createProcedure({
  input: z.object({
    a: z.number(),
    b: z.number(),
  }),
  output: z.number(),
  acl: { type: "public" },
  handler: async ({ context, input }) => {
    return input.a + input.b;
  },
});

const concat = createProcedure({
  input: z.object({
    a: z.string(),
    b: z.string(),
  }),
  output: z.string(),
  acl: { type: "public" },
  handler: async ({ context, input }) => {
    return input.a + input.b;
  },
});

const stealTreasure = createProcedure({
  input: z.object({
    amount: z.number(),
  }),
  output: z.number(),
  acl: { type: "private", allow: async () => false },
  handler: async ({ context, input }) => {
    return input.amount;
  },
});

describe("Brpc", () => {
  afterEach(() => {
    for (const cleanup of CLEANUP) {
      cleanup();
    }
  });

  it("should work", async function () {
    this.timeout(15000);

    const server = await createServer({
      xmtp: await Client.create(serverWallet),
      api: { add, concat },
    });

    const { client, close } = await createClient({
      xmtp: await Client.create(clientWallet),
      address: serverWallet.address,
      api: { add, concat },
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

  it("should not allow public access to private procedures", async function () {
    this.timeout(15000);

    const server = await createServer({
      xmtp: await Client.create(serverWallet),
      api: { stealTreasure },
    });

    const { client, close } = await createClient({
      xmtp: await Client.create(clientWallet),
      address: serverWallet.address,
      api: { stealTreasure },
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

    const auth = createProcedure({
      input: z.undefined(),
      output: z.literal("you are authorized"),
      acl: {
        type: "private",
        allow: async ({ context }) => {
          return context.message.senderAddress === authorizedWallet.address;
        },
      },
      handler: async ({ input }) => {
        return "you are authorized" as const;
      },
    });

    const server = await createServer({
      xmtp: await Client.create(serverWallet),
      api: { auth },
    });

    const unauthorizedClient = await createClient({
      xmtp: await Client.create(clientWallet),
      address: serverWallet.address,
      api: { auth },
    });

    const authorizedClient = await createClient({
      xmtp: await Client.create(authorizedWallet),
      address: serverWallet.address,
      api: { auth },
    });

    CLEANUP.push(authorizedClient.close);
    CLEANUP.push(unauthorizedClient.close);
    CLEANUP.push(server.close);

    const unauthorizedResult = await unauthorizedClient.client.auth({
      input: undefined,
    });

    if (unauthorizedResult.ok) {
      throw new Error("auth should have failed for unauthorized client");
    }

    const authorizedResult = await authorizedClient.client.auth({
      input: undefined,
    });

    if (!authorizedResult.ok) {
      throw new Error("auth should have succeeded for authorized client");
    }

    if (authorizedResult.data !== "you are authorized") {
      throw new Error("auth returned wrong result");
    }

    console.log("AUTHORIZED RESULT IS", authorizedResult);
    console.log("AUTHORIZED RESULT IS", unauthorizedResult);
  });
});
