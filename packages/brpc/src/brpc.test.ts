import { z } from "zod";
import { Wallet } from "@ethersproject/wallet";
import { createClient } from "./createClient.js";
import { createServer } from "./createServer.js";
import { createProcedure } from "./createProcedure.js";

const authorizedWallet = Wallet.createRandom();

const CLEANUP: Array<() => void> = [];

export const priv = createProcedure({
  auth: async () => false,
  handler: async () => {
    return "You should not see this!";
  },
});

const add = createProcedure({
  input: z.object({
    a: z.number(),
    b: z.number(),
  }),
  auth: async () => true,
  handler: async ({ a, b }) => {
    return a + b;
  },
});

const concat = createProcedure({
  input: z.object({
    a: z.string(),
    b: z.string(),
  }),
  output: z.string(),
  auth: async () => true,
  handler: async ({ a, b }) => {
    return `${a}${b}`;
  },
});

const stealTreasure = createProcedure({
  input: z.object({
    amount: z.number(),
  }),
  output: z.string(),
  auth: async () => false,
  handler: async ({ amount }, ctx) => {
    return `${amount} stolen by ${ctx.message.senderAddress}`;
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
      api: { add, concat },
    });

    await server.start();

    const { api, close } = await createClient({
      address: server.address,
      api: { add, concat, priv },
    });

    CLEANUP.push(close);
    CLEANUP.push(server.close);

    const addResult = await api.add({ a: 1, b: 2 });

    if (!addResult.ok) {
      console.error(addResult);
      throw new Error("add failed");
    }

    if (addResult.data !== 3) {
      console.error(addResult);
      throw new Error("add returned wrong result");
    }

    const concatResult = await api.concat({ a: "hello", b: "world" });

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
      api: { stealTreasure },
    });

    await server.start();

    const { api: client, close } = await createClient({
      address: server.address,
      api: { stealTreasure },
    });

    CLEANUP.push(close);
    CLEANUP.push(server.close);

    const result = await client.stealTreasure({ amount: 100 });

    if (result.ok) {
      throw new Error("stealTreasure should have failed");
    }

    if (result.code !== "UNAUTHORIZED") {
      throw new Error(
        "stealTreasure should have failed with UNAUTHORIZED code",
      );
    }

    console.log("RESULT IS", result);
  });

  it("should allow authorized access to private procedures", async function () {
    this.timeout(15000);

    const auth = createProcedure({
      output: z.literal("you are authorized"),
      auth: async ({ context }) => {
        return context.message.senderAddress === authorizedWallet.address;
      },
      handler: async () => {
        return "you are authorized" as const;
      },
    });

    const server = await createServer({
      api: { auth },
    });

    await server.start();

    const unauthorizedClient = await createClient({
      address: server.address,
      api: { auth },
    });

    const authorizedClient = await createClient({
      address: server.address,
      api: { auth },
      options: {
        wallet: authorizedWallet,
      },
    });

    CLEANUP.push(authorizedClient.close);
    CLEANUP.push(unauthorizedClient.close);
    CLEANUP.push(server.close);

    const x = auth.handler;

    const unauthorizedResult = await unauthorizedClient.api.auth();

    if (unauthorizedResult.ok) {
      throw new Error("auth should have failed for unauthorized client");
    }

    const authorizedResult = await authorizedClient.api.auth();

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
