import { z } from "zod";
import { Wallet } from "@ethersproject/wallet";
import { createApi } from "./createApi.js";
import { createClient } from "./createClient.js";
import { createServer } from "./createServer.js";
import { createRouter } from "./createRouter.js";
import { Client } from "@xmtp/xmtp-js";

const clientWallet = Wallet.createRandom();
const serverWallet = Wallet.createRandom();

describe("Brpc", () => {
  it("should work", async function () {
    this.timeout(15000);

    const api = createApi({
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

    const router = createRouter({
      api,
      router: {
        add: {
          inputSchema: api.add.input,
          handler: async ({ context, input }) => {
            return input.a + input.b;
          },
        },
        concat: {
          inputSchema: api.concat.input,
          handler: async ({ context, input }) => {
            return input.a + input.b;
          },
        },
      },
    });

    await createServer({
      xmtp: await Client.create(serverWallet),
      router,
    });

    const client = await createClient({
      xmtp: await Client.create(clientWallet),
      address: serverWallet.address,
      api,
    });

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

    const api = createApi({
      proc: {
        input: z.object({
          a: z.string(),
          b: z.string(),
        }),
        output: z.string(),
      },
    });

    const router = createRouter({
      api,
      router: {
        notProc: {
          inputSchema: api.proc.input,
          handler: async ({ context, input }: any) => {
            return input.a + input.b;
          },
        },
      },
    } as any);

    await createServer({
      xmtp: await Client.create(serverWallet),
      router,
    });

    const client = await createClient({
      xmtp: await Client.create(clientWallet),
      address: serverWallet.address,
      api,
    });

    const result = await client.proc({ input: { a: "hey", b: "there" } });

    if (result.ok) {
      console.log("RESULT IS", result);
      throw new Error("proc should have failed");
    }

    if (result.code !== "UNKNOWN_PROCEDURE") {
      console.log("RESULT IS", result);
      throw new Error("proc should have failed with UNKNOWN_PROCEDURE");
    }

    console.log("RESULT IS", result);
  });
});
