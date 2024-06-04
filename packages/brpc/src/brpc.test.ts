import { z } from "zod";
import { Wallet } from "@ethersproject/wallet";
import { createSpec } from "./createSpec.js";
import { createClient } from "./createClient.js";
import { createServer } from "./createServer.js";
import { createApi } from "./createApi.js";
import { Client } from "@xmtp/xmtp-js";

const clientWallet = Wallet.createRandom();
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
          inputSchema: spec.add.input,
          handler: async ({ context, input }) => {
            return input.a + input.b;
          },
        },
        concat: {
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
      console.log("RESULT IS", result);
      throw new Error("proc should have failed");
    }

    if (result.code !== "UNKNOWN_PROCEDURE") {
      console.log("RESULT IS", result);
      throw new Error("proc should have failed with UNKNOWN_PROCEDURE");
    }

    console.log("RESULT IS", result);

    await close();
    await server.close();
  });
});
